import { useState, useEffect } from 'react';
import { supabase, createTestRun, callEdgeFunction } from '../../lib/supabase';
import { 
  BuildingDepartment, 
  ProjectType, 
  Occupancy, 
  ConstructionType, 
  ProjectPhase,
  Company,
  Contact
} from '../../types';
import StyledInput from '../ui/StyledInput';
import StyledSelect from '../ui/StyledSelect';
import FileUpload from '../ui/FileUpload';
import PrimaryButton from '../ui/PrimaryButton';
import LoadingSpinner from '../ui/LoadingSpinner';
import StatusBadge from '../ui/StatusBadge';

interface Scenario2FormProps {
  scenarioId: string;
}

const DEFAULT_COMPANY_ID = '79a05b0d-0f3b-404e-9fa3-ddbd13b37ad3';
const DEFAULT_CONTACT_ID = '019a7da9-cde3-7a9b-fc4d-0416789a0a46';

export default function Scenario2Form({ scenarioId }: Scenario2FormProps) {
  const [loading, setLoading] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

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
    contact_id: DEFAULT_CONTACT_ID,
    phase_id: '',
    status_id: '',
  });

  // Options
  const [buildingDepartments, setBuildingDepartments] = useState<BuildingDepartment[]>([]);
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [occupancies, setOccupancies] = useState<Occupancy[]>([]);
  const [constructionTypes, setConstructionTypes] = useState<ConstructionType[]>([]);
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    fetchOptions();
  }, []);

  async function fetchOptions() {
    try {
      const [bdRes, ptRes, occRes, ctRes, phaseRes, compRes, contRes] = await Promise.all([
        supabase.from('building_departments').select('id, name').order('name'),
        supabase.from('project_types').select('id, name').order('name'),
        supabase.from('occupancies').select('id, name').order('name'),
        supabase.from('construction_types').select('id, name').order('name'),
        supabase.from('project_phases').select('id, name').order('name'),
        supabase.from('companies').select('id, name').eq('id', DEFAULT_COMPANY_ID),
        supabase.from('contacts').select('id, name').eq('id', DEFAULT_CONTACT_ID),
      ]);

      if (bdRes.data) setBuildingDepartments(bdRes.data);
      if (ptRes.data) setProjectTypes(ptRes.data);
      if (occRes.data) setOccupancies(occRes.data);
      if (ctRes.data) setConstructionTypes(ctRes.data);
      if (phaseRes.data) {
        setPhases(phaseRes.data);
        // Set default phase (intake/new)
        const intakePhase = phaseRes.data.find((p: any) => 
          p.name.toLowerCase().includes('intake') || p.name.toLowerCase().includes('new')
        );
        if (intakePhase) {
          setFormData(prev => ({ ...prev, phase_id: intakePhase.id }));
        }
      }
      if (compRes.data) setCompanies(compRes.data);
      if (contRes.data) setContacts(contRes.data);
    } catch (err) {
      console.error('Error fetching options:', err);
    }
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

      // Upload files if any
      const filePaths: string[] = [];
      if (files.length > 0) {
        for (const file of files) {
          const filePath = `testlab/projects/${newRunId}/plans/initial/${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('files')
            .upload(filePath, file);
          
          if (uploadError) throw uploadError;
          filePaths.push(filePath);
        }
      }

      // Call edge function
      const response = await callEdgeFunction('create_test_project', {
        run_id: newRunId,
        project_data: formData,
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
      <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-fcc-white mb-4">
          Create New Project (Manual)
        </h3>

        <StyledInput
          label="Project Name *"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <StyledSelect
            label="Project Type *"
            value={formData.project_type_id}
            onChange={(e) => setFormData(prev => ({ ...prev, project_type_id: e.target.value }))}
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

          <StyledSelect
            label="Construction Type *"
            value={formData.construction_type_id}
            onChange={(e) => setFormData(prev => ({ ...prev, construction_type_id: e.target.value }))}
            options={[
              { value: '', label: 'Select...' },
              ...constructionTypes.map(ct => ({ value: ct.id, label: ct.name }))
            ]}
            required
          />
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StyledSelect
            label="Company"
            value={formData.company_id}
            onChange={(e) => setFormData(prev => ({ ...prev, company_id: e.target.value }))}
            options={[
              ...companies.map(comp => ({ value: comp.id, label: comp.name }))
            ]}
          />

          <StyledSelect
            label="Contact"
            value={formData.contact_id}
            onChange={(e) => setFormData(prev => ({ ...prev, contact_id: e.target.value }))}
            options={[
              ...contacts.map(cont => ({ value: cont.id, label: cont.name }))
            ]}
          />

          <StyledSelect
            label="Phase"
            value={formData.phase_id}
            onChange={(e) => setFormData(prev => ({ ...prev, phase_id: e.target.value }))}
            options={[
              { value: '', label: 'Select...' },
              ...phases.map(phase => ({ value: phase.id, label: phase.name }))
            ]}
          />
        </div>

        <FileUpload
          label="Plan Set Files"
          accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png"
          multiple
          onFilesSelected={setFiles}
        />

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? 'Creating Project...' : 'Create Project'}
        </PrimaryButton>
      </div>

      {loading && (
        <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <LoadingSpinner />
            <span className="text-fcc-white">Creating project...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-fcc-dark border border-red-500 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-2">
            <StatusBadge status="failed" />
            <span className="text-red-500 font-semibold">Error</span>
          </div>
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {results && runId && (
        <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-6 space-y-4">
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

