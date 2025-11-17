import { useState, useEffect, useRef } from 'react';
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
import StyledTextarea from '../ui/StyledTextarea';
import SearchableSelect from '../ui/SearchableSelect';
import FileUpload from '../ui/FileUpload';
import PrimaryButton from '../ui/PrimaryButton';
import LoadingSpinner from '../ui/LoadingSpinner';
import StatusBadge from '../ui/StatusBadge';

interface ManualProjectFormProps {
  scenarioId: string;
}

const DEFAULT_COMPANY_NAME = 'Josh Test Project Company 1';
const DEFAULT_CONTACT_NAME = 'John Client';

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
    address_line2: '',
    city: '',
    state: 'FL',
    zipcode: '',
    company_id: '',
    contact_id: '',
    service_ids: [] as string[],
    scope_of_work: '',
    needs_quote: false,
  });

  // Google Places state
  const [addressSearch, setAddressSearch] = useState('');
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [addressSelected, setAddressSelected] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Options
  const [buildingDepartments, setBuildingDepartments] = useState<BuildingDepartment[]>([]);
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [selectedConstructionType, setSelectedConstructionType] = useState<ConstructionType | null>(null);
  const [selectedOccupancy, setSelectedOccupancy] = useState<Occupancy | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [services, setServices] = useState<Array<{ id: string; name: string }>>([]);
  const [projectCreated, setProjectCreated] = useState(false);
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);
  const [showPlanSetUpload, setShowPlanSetUpload] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);

  useEffect(() => {
    fetchOptions();
    initializeGooglePlaces();
    getUserLocation();
  }, []);

  // Initialize Google Places API when script loads
  useEffect(() => {
    const checkGoogle = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        const service = new google.maps.places.AutocompleteService();
        setAutocompleteService(service);
        
        // Create a dummy div for PlacesService (it needs a div element)
        const dummyDiv = document.createElement('div');
        const places = new google.maps.places.PlacesService(dummyDiv);
        setPlacesService(places);
        clearInterval(checkGoogle);
      }
    }, 100);

    return () => clearInterval(checkGoogle);
  }, []);

  // Get user's location for proximity-based suggestions
  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Could not get user location:', error);
          // Default to Florida center if location unavailable
          setUserLocation({ lat: 27.7663, lng: -82.6404 });
        }
      );
    } else {
      // Default to Florida center if geolocation not available
      setUserLocation({ lat: 27.7663, lng: -82.6404 });
    }
  }

  function initializeGooglePlaces() {
    // Load Google Places API script if not already loaded
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCYPEXUyBOcHqWh0xU2Dna-zcYJzebqQ6k&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && window.google.maps && window.google.maps.places) {
          const service = new google.maps.places.AutocompleteService();
          setAutocompleteService(service);
          
          const dummyDiv = document.createElement('div');
          const places = new google.maps.places.PlacesService(dummyDiv);
          setPlacesService(places);
        }
      };
      document.head.appendChild(script);
    }
  }

  // Handle address search input - only fetch if user is actively typing (not just selected)
  useEffect(() => {
    if (!addressSearch.trim() || !autocompleteService || !userLocation) {
      // Don't clear suggestions if address is selected (user might want to see them again)
      if (!addressSelected) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
      return;
    }

    // Only auto-fetch suggestions if address hasn't been selected yet
    // This prevents auto-fetching while user is viewing selected address
    if (addressSelected) {
      return;
    }

    const request: google.maps.places.AutocompletionRequest = {
      input: addressSearch,
      location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
      radius: 50000, // 50km radius
    };

    autocompleteService.getPlacePredictions(request, (predictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        setSuggestions(predictions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    });
  }, [addressSearch, autocompleteService, userLocation, addressSelected]);

  // Function to fetch suggestions manually (when user focuses field)
  function fetchAddressSuggestions() {
    if (!addressSearch.trim() || !autocompleteService || !userLocation) {
      return;
    }

    const request: google.maps.places.AutocompletionRequest = {
      input: addressSearch,
      location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
      radius: 50000, // 50km radius
    };

    autocompleteService.getPlacePredictions(request, (predictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        setSuggestions(predictions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    });
  }

  // Handle click outside suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        addressInputRef.current &&
        !addressInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    // Only add listener if suggestions are showing
    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSuggestions]);

  // Handle address selection
  function handleAddressSelect(placeId: string, description?: string) {
    // Close suggestions immediately and clear them
    setShowSuggestions(false);
    setSuggestions([]);
    setAddressSelected(true);
    
    if (!placesService) {
      // If placesService isn't ready, wait a bit and try again
      setTimeout(() => handleAddressSelect(placeId, description), 100);
      return;
    }

    // Update search field immediately with the selected description
    if (description) {
      setAddressSearch(description);
    }

    const request: google.maps.places.PlaceDetailsRequest = {
      placeId,
      fields: ['address_components', 'formatted_address'],
    };

    placesService.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        const components = place.address_components || [];
        
        let addressLine1 = '';
        let addressLine2 = '';
        let city = '';
        let state = '';
        let zipcode = '';

        components.forEach((component) => {
          const types = component.types;

          if (types.includes('street_number')) {
            addressLine1 = component.long_name;
          }
          if (types.includes('route')) {
            addressLine1 = addressLine1 ? `${addressLine1} ${component.long_name}` : component.long_name;
          }
          if (types.includes('subpremise')) {
            addressLine2 = component.long_name;
          }
          if (types.includes('locality')) {
            city = component.long_name;
          }
          if (types.includes('administrative_area_level_1')) {
            state = component.short_name;
          }
          if (types.includes('postal_code')) {
            zipcode = component.long_name;
          }
        });

        // Update all fields at once
        setFormData(prev => ({
          ...prev,
          address_line1: addressLine1,
          address_line2: addressLine2,
          city: city,
          state: state || prev.state,
          zipcode: zipcode,
        }));

        setAddressSearch(place.formatted_address || description || addressLine1);
      } else {
        console.error('Error fetching place details:', status);
      }
    });
  }

  // Fetch contacts when company changes
  useEffect(() => {
    if (formData.company_id) {
      fetchContacts(formData.company_id).then((contactList) => {
        // After contacts are loaded, set default contact if this is the default company
        const defaultCompany = companies.find(c => c.name === DEFAULT_COMPANY_NAME);
        if (defaultCompany && formData.company_id === defaultCompany.id && contactList) {
          // Find John Client in the contacts
          const defaultContact = contactList.find((c: Contact) => 
            c.name === DEFAULT_CONTACT_NAME || 
            (c.first_name === 'John' && c.last_name === 'Client')
          );
          if (defaultContact && !formData.contact_id) {
            setFormData(prev => ({ ...prev, contact_id: defaultContact.id }));
          }
        }
      });
    } else {
      setContacts([]);
      setFormData(prev => ({ ...prev, contact_id: '' }));
    }
  }, [formData.company_id, companies]);

  // Fetch construction type and occupancy when project type changes
  useEffect(() => {
    if (formData.project_type_id) {
      fetchProjectTypeDetails(formData.project_type_id);
    } else {
      setSelectedConstructionType(null);
      setSelectedOccupancy(null);
      setFormData(prev => ({ ...prev, construction_type_id: '', occupancy_id: '' }));
    }
  }, [formData.project_type_id]);

  async function fetchOptions() {
    try {
      const [bdRes, ptRes, compRes, servicesRes, fileTypesRes] = await Promise.all([
        supabase.from('building_departments').select('id, name').is('deleted_at', null).order('name'),
        supabase.from('project_types').select('id, name').is('deleted_at', null).order('name'),
        supabase.from('companies').select('id, name').is('deleted_at', null).order('name'),
        supabase.from('services').select('id, name').is('deleted_at', null).order('name'),
        supabase.from('plan_sets_file_types').select('id, name, code').eq('active', true).is('deleted_at', null).order('name'),
      ]);

      if (bdRes.data) setBuildingDepartments(bdRes.data);
      if (ptRes.data) setProjectTypes(ptRes.data);
      if (servicesRes.data) {
        // Sort services: Permit Expediting, Plan Review, Inspections, then others
        const sortedServices = [...servicesRes.data].sort((a, b) => {
          const order: Record<string, number> = {
            'Permit Expediting': 1,
            'Plan Review': 2,
            'Inspections': 3,
          };
          const aOrder = order[a.name] || 999;
          const bOrder = order[b.name] || 999;
          return aOrder - bOrder;
        });
        setServices(sortedServices);
      }
      if (compRes.data) {
        const allCompanies = compRes.data;
        setCompanies(allCompanies);
        
        // Find and set default company
        const defaultCompany = allCompanies.find(c => 
          c.name === DEFAULT_COMPANY_NAME
        );
        if (defaultCompany) {
          setFormData(prev => ({ ...prev, company_id: defaultCompany.id }));
          // Fetch contacts for default company and set default contact
          const contactList = await fetchContacts(defaultCompany.id);
          if (contactList) {
            const defaultContact = contactList.find((c: Contact) => 
              c.name === DEFAULT_CONTACT_NAME || 
              (c.first_name === 'John' && c.last_name === 'Client')
            );
            if (defaultContact) {
              setFormData(prev => ({ ...prev, contact_id: defaultContact.id }));
            }
          }
        }
      }
      if (fileTypesRes.data) {
        console.log('File types loaded:', fileTypesRes.data);
        // Sort file types: "Other Documents" should be last
        const sortedFileTypes = [...fileTypesRes.data].sort((a, b) => {
          if (a.name === 'Other Documents') return 1;
          if (b.name === 'Other Documents') return -1;
          return a.name.localeCompare(b.name);
        });
        setFileTypes(sortedFileTypes);
      } else {
        console.warn('No file types found');
      }
    } catch (err) {
      console.error('Error fetching options:', err);
    }
  }

  async function fetchProjectTypeDetails(projectTypeId: string) {
    try {
      // Fetch project type with its construction type and occupancy
      const { data: projectType, error: ptError } = await supabase
        .from('project_types')
        .select('id, name, construction_type_id, construction_types(id, name, occupancy_id, occupancies(id, name))')
        .eq('id', projectTypeId)
        .is('deleted_at', null)
        .single();

      if (ptError) throw ptError;

      if (projectType && projectType.construction_types) {
        const constructionType = projectType.construction_types as any;
        setSelectedConstructionType({
          id: constructionType.id,
          name: constructionType.name,
        } as ConstructionType);

        // Set construction_type_id in form
        setFormData(prev => ({ ...prev, construction_type_id: constructionType.id }));

        if (constructionType.occupancies) {
          const occupancy = constructionType.occupancies as any;
          setSelectedOccupancy({
            id: occupancy.id,
            name: occupancy.name,
          } as Occupancy);

          // Set occupancy_id in form
          setFormData(prev => ({ ...prev, occupancy_id: occupancy.id }));
        } else {
          setSelectedOccupancy(null);
          setFormData(prev => ({ ...prev, occupancy_id: '' }));
        }
      } else {
        setSelectedConstructionType(null);
        setSelectedOccupancy(null);
        setFormData(prev => ({ ...prev, construction_type_id: '', occupancy_id: '' }));
      }
    } catch (err) {
      console.error('Error fetching project type details:', err);
      setSelectedConstructionType(null);
      setSelectedOccupancy(null);
      setFormData(prev => ({ ...prev, construction_type_id: '', occupancy_id: '' }));
    }
  }

  async function fetchContacts(companyId: string) {
    try {
      const { data, error } = await supabase
        .from('companies__contacts')
        .select('contact_id, contacts(id, first_name, last_name)')
        .eq('company_id', companyId)
        .is('deleted_at', null);

      if (error) throw error;
      if (data) {
        const contactList = data
          .map((item: any) => {
            const contact = item.contacts;
            if (contact) {
              return {
                ...contact,
                name: `${contact.first_name || ''} ${contact.last_name || ''}`.trim(),
              };
            }
            return null;
          })
          .filter(Boolean) as Contact[];
        setContacts(contactList);
        return contactList;
      }
      return [];
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setContacts([]);
      return [];
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

      // Call edge function to create project (without files for now)
      // Note: contact_id from form should be mapped to submitted_by_id in the edge function
      const response = await callEdgeFunction('create_test_project', {
        run_id: newRunId,
        project_data: {
          ...formData,
          // phase_id is set by the backend, don't send it
          // contact_id is included in formData and will be mapped to submitted_by_id by the edge function
        },
        service_ids: formData.service_ids, // Top-level array
        files: {}, // No files on initial creation
        mode: 'manual',
      });

      setResults(response);
      setProjectCreated(true);
      // Read project_id from either data.project_id or top-level project_id
      const projectId = response.data?.project_id ?? response.project_id;
      if (projectId) {
        setCreatedProjectId(projectId);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to execute scenario');
    } finally {
      setLoading(false);
    }
  }

  async function handlePlanSetUpload() {
    if (!createdProjectId) {
      setError('Project ID is required for file upload');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Upload files
      const filePaths: Record<string, string[]> = {};
      for (const [fileTypeId, files] of Object.entries(fileUploads)) {
        if (files.length > 0) {
          const type = fileTypes.find(ft => ft.id === fileTypeId);
          const paths: string[] = [];
          for (const file of files) {
            const filePath = `testlab/projects/${createdProjectId}/plans/${type?.code || 'other'}/${file.name}`;
            const { error: uploadError } = await supabase.storage
              .from('files')
              .upload(filePath, file);
            
            if (uploadError) throw uploadError;
            paths.push(filePath);
          }
          filePaths[fileTypeId] = paths;
        }
      }

      // Call edge function to create plan set and link files
      // This would need to be a new edge function or update to existing one
      // For now, we'll just show success
      setResults({ ...results, files_uploaded: filePaths });
    } catch (err: any) {
      setError(err.message || 'Failed to upload plan set files');
    } finally {
      setLoading(false);
    }
  }

  // Handle service selection with Plan Review -> Inspections dependency
  function handleServiceToggle(serviceId: string) {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    setServicesError(null);

    // Check if this is Plan Review
    if (service.name === 'Plan Review') {
      const isPlanReviewSelected = formData.service_ids.includes(serviceId);
      if (isPlanReviewSelected) {
        // Deselecting Plan Review - remove both Plan Review and Inspections
        const inspectionsService = services.find(s => s.name === 'Inspections');
        setFormData(prev => ({
          ...prev,
          service_ids: prev.service_ids.filter(id => id !== serviceId && id !== inspectionsService?.id),
        }));
      } else {
        // Selecting Plan Review - auto-select Inspections too
        const inspectionsService = services.find(s => s.name === 'Inspections');
        const newServiceIds = [...formData.service_ids, serviceId];
        if (inspectionsService && !newServiceIds.includes(inspectionsService.id)) {
          newServiceIds.push(inspectionsService.id);
        }
        setFormData(prev => ({ ...prev, service_ids: newServiceIds }));
      }
    } else if (service.name === 'Inspections') {
      // Check if Plan Review is selected
      const planReviewService = services.find(s => s.name === 'Plan Review');
      const isPlanReviewSelected = planReviewService && formData.service_ids.includes(planReviewService.id);
      const isInspectionsSelected = formData.service_ids.includes(serviceId);

      if (isPlanReviewSelected && isInspectionsSelected) {
        // User trying to deselect Inspections while Plan Review is selected
        setServicesError('Plan Review cannot be selected without Inspections');
        return;
      }

      // Toggle Inspections normally
      setFormData(prev => ({
        ...prev,
        service_ids: isInspectionsSelected
          ? prev.service_ids.filter(id => id !== serviceId)
          : [...prev.service_ids, serviceId],
      }));
    } else {
      // Toggle other services normally
      setFormData(prev => ({
        ...prev,
        service_ids: prev.service_ids.includes(serviceId)
          ? prev.service_ids.filter(id => id !== serviceId)
          : [...prev.service_ids, serviceId],
      }));
    }
  }

  // If project is created, show simplified view
  if (projectCreated && createdProjectId) {
    return (
      <div className="space-y-6">
        <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-6 space-y-4">
          <div>
            <p className="text-sm text-fcc-white/70 mb-1">Project Name:</p>
            <p className="text-fcc-white font-semibold text-lg">{formData.name}</p>
          </div>
          <div>
            <p className="text-sm text-fcc-white/70 mb-1">Project ID:</p>
            <p className="text-fcc-white font-mono text-sm">{createdProjectId}</p>
          </div>
          
          {!showPlanSetUpload && (
            <PrimaryButton
              type="button"
              onClick={() => setShowPlanSetUpload(true)}
              disabled={loading}
            >
              Upload Plan Set
            </PrimaryButton>
          )}

          {showPlanSetUpload && (
            <div className="space-y-4 mt-6">
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
              <PrimaryButton
                type="button"
                onClick={handlePlanSetUpload}
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Upload Files'}
              </PrimaryButton>
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

          {results && results.files_uploaded && (
            <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <StatusBadge status="success" />
                <span className="text-fcc-white font-semibold">Files Uploaded Successfully</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Project Name */}
        <StyledInput
          label="Project Name *"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />

        {/* 2. Company */}
        <StyledSelect
          label="Company *"
          value={formData.company_id}
          onChange={(e) => setFormData(prev => ({ ...prev, company_id: e.target.value, contact_id: '' }))}
          options={[
            { value: '', label: 'Select...' },
            ...companies.map(comp => ({ value: comp.id, label: comp.name }))
          ]}
          required
        />

        {/* 3. Submission Contact - conditionally visible */}
        {formData.company_id && (
          <StyledSelect
            label="Submission Contact"
            value={formData.contact_id}
            onChange={(e) => setFormData(prev => ({ ...prev, contact_id: e.target.value }))}
            options={[
              { value: '', label: 'Select...' },
              ...contacts.map(cont => ({ value: cont.id, label: cont.name || `${cont.first_name || ''} ${cont.last_name || ''}`.trim() }))
            ]}
          />
        )}

        {/* 4. Building Department */}
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

        {/* 5. Project Type - user selection */}
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

        {/* 6. Construction Type - read-only, populated from project type */}
        {selectedConstructionType && (
          <div>
            <label className="block text-sm font-medium text-fcc-white mb-2">
              Construction Type
            </label>
            <div className="w-full px-4 py-2 bg-fcc-black border border-fcc-divider rounded-lg text-fcc-white/70">
              {selectedConstructionType.name}
            </div>
          </div>
        )}

        {/* 7. Occupancy - read-only, populated from construction type */}
        {selectedOccupancy && (
          <div>
            <label className="block text-sm font-medium text-fcc-white mb-2">
              Occupancy
            </label>
            <div className="w-full px-4 py-2 bg-fcc-black border border-fcc-divider rounded-lg text-fcc-white/70">
              {selectedOccupancy.name}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Address Search with Google Places Autocomplete */}
        <div className="relative" ref={suggestionsRef}>
          <label className="block text-sm font-medium text-fcc-white mb-2">
            Search Address *
          </label>
          <input
            ref={addressInputRef}
            type="text"
            value={addressSearch}
            onChange={(e) => {
              setAddressSearch(e.target.value);
              // If user starts typing again after selecting, allow new search
              if (addressSelected) {
                setAddressSelected(false);
              }
            }}
            onFocus={() => {
              // When user focuses the field, fetch and show suggestions if there's text
              if (addressSearch.trim()) {
                fetchAddressSuggestions();
              }
            }}
            placeholder="Start typing an address..."
            className="w-full bg-fcc-black border border-fcc-divider rounded-lg px-4 py-2 text-fcc-white placeholder-fcc-white/50 focus:outline-none focus:ring-2 focus:ring-fcc-cyan focus:border-transparent"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-fcc-dark border border-fcc-divider rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.place_id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddressSelect(suggestion.place_id, suggestion.description);
                    // Blur the input to remove focus
                    if (addressInputRef.current) {
                      addressInputRef.current.blur();
                    }
                  }}
                  onMouseDown={(e) => {
                    // Prevent input from getting focus when clicking button
                    e.preventDefault();
                  }}
                  className="w-full text-left px-4 py-2 text-fcc-white hover:bg-fcc-divider transition-colors"
                >
                  <div className="font-medium">{suggestion.structured_formatting.main_text}</div>
                  <div className="text-sm text-fcc-white/70">{suggestion.structured_formatting.secondary_text}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Address fields - only show after address is selected */}
        {addressSelected && (
          <>
            {/* Address Line 1 - auto-filled from Places */}
            <StyledInput
              label="Address Line 1 *"
              value={formData.address_line1}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, address_line1: e.target.value }));
                setAddressSearch(e.target.value);
              }}
              required
            />

            {/* Address Line 2 - auto-filled from Places */}
            <StyledInput
              label="Address Line 2"
              value={formData.address_line2}
              onChange={(e) => setFormData(prev => ({ ...prev, address_line2: e.target.value }))}
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
          </>
        )}
      </div>

      {/* Services - Multi-select with checkboxes */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-fcc-white mb-2">
          Services
        </label>
        <div className="space-y-2">
          {services.length === 0 ? (
            <p className="text-fcc-white/70 text-sm">Loading services...</p>
          ) : (
            services.map((service) => {
              const isSelected = formData.service_ids.includes(service.id);

              return (
                <label
                  key={service.id}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-fcc-dark/50 p-2 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleServiceToggle(service.id)}
                    className="w-5 h-5 rounded border-fcc-divider bg-fcc-black text-fcc-cyan focus:ring-2 focus:ring-fcc-cyan focus:ring-offset-2 focus:ring-offset-fcc-black"
                  />
                  <span className="text-fcc-white">
                    {service.name}
                  </span>
                </label>
              );
            })
          )}
        </div>
        {servicesError && (
          <p className="text-sm text-red-500 mt-1">{servicesError}</p>
        )}
      </div>

      {/* Scope of Work */}
      <StyledTextarea
        label="Scope of Work"
        value={formData.scope_of_work}
        onChange={(e) => setFormData(prev => ({ ...prev, scope_of_work: e.target.value }))}
        placeholder="Enter scope of work details..."
        rows={4}
      />

      {/* Needs Quote Checkbox */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="needs_quote"
          checked={formData.needs_quote}
          onChange={(e) => setFormData(prev => ({ ...prev, needs_quote: e.target.checked }))}
          className="w-5 h-5 rounded border-fcc-divider bg-fcc-black text-fcc-cyan focus:ring-2 focus:ring-fcc-cyan focus:ring-offset-2 focus:ring-offset-fcc-black"
        />
        <label htmlFor="needs_quote" className="text-fcc-white cursor-pointer">
          Needs Quote?
        </label>
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

    </form>
  );
}

