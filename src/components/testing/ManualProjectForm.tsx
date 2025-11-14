import { useState, useEffect } from 'react';
import { supabase, createTestRun, callEdgeFunction } from '../../lib/supabase';
import { 
  BuildingDepartment, 
  ProjectType, 
  Occupancy, 
  ConstructionType,
  Company,
  Contact
} from '../../types';
import StyledInput from '../ui/StyledInput';
import StyledSelect from '../ui/StyledSelect';
import SearchableSelect from '../ui/SearchableSelect';
import FileUpload from '../ui/FileUpload';
import PrimaryButton from '../ui/PrimaryButton';
import LoadingSpinner from '../ui/LoadingSpinner';
import StatusBadge from '../ui/StatusBadge';

interface ManualProjectFormProps {
  scenarioId: string;
}

const DEFAULT_COMPANY_ID = '79a05b0d-0f3b-404e-9fa3-ddbd13b37ad3';

export default function ManualProjectForm({ scenarioId }: ManualProjectFormProps) {
  const [loading, setLoading] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileTypes, setFileTypes] = useState<Array<{ id: string; name: string; code: string }>>([]);
  const [fileUploads, setFileUploads] = useState<Record<string, File[]>>({});

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    building_department_id: '',
    project_type_id: '',
    occupancy_id: '',
    construction_type_id: '',
    address_line1: '',
    city: '',
    state: 'FL',
    zipcode: '',
    company_id: DEFAULT_COMPANY_ID,
    contact_id: '',
  });

  // Options
  const [buildingDepartments, setBuildingDepartments] = useState<BuildingDepartment[]>([]);
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [occupancies, setOccupancies] = useState<Occupancy[]>([]);
  const [constructionTypes, setConstructionTypes] = useState<ConstructionType[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    if (formData.company_id) {
      fetchContacts(formData.company_id);
    } else {
      setContacts([]);
      setFormData(prev => ({ ...prev, contact_id: '' }));
    }
  }, [formData.company_id]);

  async function fetchOptions() {
    try {
      const [bdRes, ptRes, occRes, ctRes, compRes, fileTypesRes] = await Promise.all([
        supabase.from('building_departments').select('id, name').is('deleted_at', null).order('name'),
        supabase.from('project_types').select('id, name').is('deleted_at', null).order('name'),
        supabase.from('occupancies').select('id, name').is('deleted_at', null).order('name'),
        supabase.from('construction_types').select('id, name').is('deleted_at', null).order('name'),
        supabase.from('companies').select('id, name').is('deleted_at', null).order('name'),
        supabase.from('plan_sets_file_types').select('id, name, code').eq('active', true).is('deleted_at', null).order('name'),
      ]);

      if (bdRes.data) setBuildingDepartments(bdRes.data);
      if (ptRes.data) setProjectTypes(ptRes.data);
      if (occRes.data) setOccupancies(occRes.data);
      if (ctRes.data) setConstructionTypes(ctRes.data);
      if (compRes.data) {
        // Include default company if it exists, otherwise just use all companies
        const allCompanies = compRes.data;
        setCompanies(allCompanies);
        // Set default if it exists in the list
        if (!allCompanies.find(c => c.id === DEFAULT_COMPANY_ID)) {
          // Try to fetch default company separately
          const { data: defaultComp } = await supabase
            .from('companies')
            .select('id, name')
            .eq('id', DEFAULT_COMPANY_ID)
            .single();
          if (defaultComp) {
            setCompanies([defaultComp, ...allCompanies]);
          }
        }
      }
      if (fileTypesRes.data) {
        console.log('File types loaded:', fileTypesRes.data);
        setFileTypes(fileTypesRes.data);
      } else {
        console.warn('No file types found');
      }
    } catch (err) {
      console.error('Error fetching options:', err);
    }
  }

  async function fetchContacts(companyId: string) {
    try {
      const { data } = await supabase
        .from('companies__contacts')
        .select('contacts(id, name)')
        .eq('company_id', companyId);

      if (data) {
        const contactList = data
          .map((item: any) => item.contacts)
          .filter(Boolean) as Contact[];
        setContacts(contactList);
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
    }
  }

  function handleFileUpload(fileTypeId: string, files: File[]) {
    setFileUploads(prev => ({ ...prev, [fileTypeId]: files }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setResults(null);

      // Create test run
      const newRunId = await createTestRun(scenarioId, null);
      setRunId(newRunId);

      // Upload files
      const filePaths: Record<string, string[]> = {};
      for (const [fileTypeId, files] of Object.entries(fileUploads)) {
        if (files.length > 0) {
          const type = fileTypes.find(ft => ft.id === fileTypeId);
          const paths: string[] = [];
          for (const file of files) {
            const filePath = `testlab/projects/${newRunId}/plans/${type?.code || 'other'}/${file.name}`;
            const { error: uploadError } = await supabase.storage
              .from('files')
              .upload(filePath, file);
            
            if (uploadError) throw uploadError;
            paths.push(filePath);
          }
          filePaths[fileTypeId] = paths;
        }
      }

      // Call edge function
      const response = await callEdgeFunction('create_test_project', {
        run_id: newRunId,
        project_data: {
          ...formData,
          phase_id: '2', // Intake phase
        },
        files: filePaths,
        mode: 'manual',
      });

      setResults(response);
    } catch (err: any) {
      setError(err.message || 'Failed to execute scenario');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StyledInput
          label="Project Name *"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />

        <StyledSelect
          label="Building Department *"
          value={formData.building_department_id}
          onChange={(e) => setFormData(prev => ({ ...prev, building_department_id: e.target.value }))}
          options={[
            { value: '', label: 'Select...' },
            ...buildingDepartments.map(bd => ({ value: bd.id, label: bd.name }))
          ]}
          required
        />

        <SearchableSelect
          label="Project Type *"
          value={formData.project_type_id}
          onChange={(value) => setFormData(prev => ({ ...prev, project_type_id: value }))}
          options={[
            { value: '', label: 'Select...' },
            ...projectTypes.map(pt => ({ value: pt.id, label: pt.name }))
          ]}
          required
        />

        <StyledSelect
          label="Occupancy *"
          value={formData.occupancy_id}
          onChange={(e) => setFormData(prev => ({ ...prev, occupancy_id: e.target.value }))}
          options={[
            { value: '', label: 'Select...' },
            ...occupancies.map(occ => ({ value: occ.id, label: occ.name }))
          ]}
          required
        />

        <SearchableSelect
          label="Construction Type *"
          value={formData.construction_type_id}
          onChange={(value) => setFormData(prev => ({ ...prev, construction_type_id: value }))}
          options={[
            { value: '', label: 'Select...' },
            ...constructionTypes.map(ct => ({ value: ct.id, label: ct.name }))
          ]}
          required
        />

        <StyledSelect
          label="Company"
          value={formData.company_id}
          onChange={(e) => setFormData(prev => ({ ...prev, company_id: e.target.value, contact_id: '' }))}
          options={companies.map(comp => ({ value: comp.id, label: comp.name }))}
        />
      </div>

      {formData.company_id && (
        <StyledSelect
          label="Contact"
          value={formData.contact_id}
          onChange={(e) => setFormData(prev => ({ ...prev, contact_id: e.target.value }))}
          options={[
            { value: '', label: 'Select...' },
            ...contacts.map(cont => ({ value: cont.id, label: cont.name }))
          ]}
        />
      )}

      <div className="space-y-4">
        <StyledInput
          label="Address Line 1 *"
          value={formData.address_line1}
          onChange={(e) => setFormData(prev => ({ ...prev, address_line1: e.target.value }))}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StyledInput
            label="City *"
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            required
          />

          <StyledInput
            label="State *"
            value={formData.state}
            onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
            required
          />

          <StyledInput
            label="Zipcode *"
            value={formData.zipcode}
            onChange={(e) => setFormData(prev => ({ ...prev, zipcode: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-fcc-white font-semibold">Plan Set Files</h4>
        {fileTypes.map((fileType) => (
          <FileUpload
            key={fileType.id}
            label={fileType.name}
            accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png"
            multiple
            onFilesSelected={(files) => handleFileUpload(fileType.id, files)}
          />
        ))}
      </div>

      <PrimaryButton type="submit" disabled={loading}>
        {loading ? 'Creating Project...' : 'Create Project'}
      </PrimaryButton>

      {loading && (
        <div className="flex items-center space-x-4">
          <LoadingSpinner />
          <span className="text-fcc-white">Creating project...</span>
        </div>
      )}

      {error && (
        <div className="bg-fcc-dark border border-red-500 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <StatusBadge status="failed" />
            <span className="text-red-500 font-semibold">Error</span>
          </div>
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {results && runId && (
        <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <StatusBadge status="success" />
            <span className="text-fcc-white font-semibold">Project Created</span>
          </div>
          <div>
            <p className="text-sm text-fcc-white/70 mb-1">Run ID:</p>
            <p className="text-fcc-white font-mono text-sm">{runId}</p>
          </div>
          {results.project_id && (
            <div>
              <p className="text-sm text-fcc-white/70 mb-1">Project ID:</p>
              <p className="text-fcc-white font-mono text-sm">{results.project_id}</p>
            </div>
          )}
        </div>
      )}
    </form>
  );
}

