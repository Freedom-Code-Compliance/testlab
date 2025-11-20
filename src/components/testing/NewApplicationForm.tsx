import { useState, useEffect, useRef } from 'react';
import { createTestRun, callEdgeFunction, getCurrentUser, supabase } from '../../lib/supabase';
import StyledInput from '../ui/StyledInput';
import StyledSelect from '../ui/StyledSelect';
import StyledTextarea from '../ui/StyledTextarea';
import SearchableMultiSelect from '../ui/SearchableMultiSelect';
import PrimaryButton from '../ui/PrimaryButton';
import LoadingSpinner from '../ui/LoadingSpinner';
import StatusBadge from '../ui/StatusBadge';
import chatgptLogo from '/chatgpt logo transparent.png';

interface NewApplicationFormProps {
  scenarioId: string;
}

interface AdditionalContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneExtension: string;
}

interface CreatedApplicationEntities {
  companyId: string | null;
  primaryContactId: string | null;
  additionalContactIds: string[];
  dealId: string | null;
  licenseId: string | null;
}

export default function NewApplicationForm({ scenarioId }: NewApplicationFormProps) {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [formDisabled, setFormDisabled] = useState(false);
  const [formCollapsed, setFormCollapsed] = useState(false);
  const [aiMessage, setAiMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [createdEntities, setCreatedEntities] = useState<CreatedApplicationEntities | null>(null);

  // Form state - Company fields
  const [formData, setFormData] = useState({
    // Company basic info
    company_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: 'FL',
    zipcode: '',
    hasWebsite: false,
    website: '',
    isLicensed: false,
    licenseNumber: '',
    
    // Company details
    monthlyPermittedProjects: '',
    annualRevenue: '',
    techSavvy: '',
    techDescription: '',
    employeeQuantity: '',
    officeStaff: false,
    officeStaffQuantity: '',
    fieldStaff: false,
    fieldStaffQuantity: '',
    referralSourceId: '',
    previousPrivateProvider: false,
    previousPPName: '',
    organizationId: '',
    interestId: '',
    interestDescription: '',
    
    // Multi-select arrays
    buildingDepartments: [] as string[],
    project_type_ids: [] as string[],
    industryRole: [] as string[],
    techTools: [] as string[],
    services: [] as string[],
    
    // Primary contact
    primaryContact_firstName: '',
    primaryContact_lastName: '',
    primaryContact_email: '',
    primaryContact_phone: '',
    primaryContact_phoneExtension: '',
  });

  const [additionalContacts, setAdditionalContacts] = useState<AdditionalContact[]>([]);

  // Reference table options
  const [buildingDepartments, setBuildingDepartments] = useState<Array<{ id: string; name: string }>>([]);
  const [services, setServices] = useState<Array<{ id: string; name: string }>>([]);
  const [projectTypes, setProjectTypes] = useState<Array<{ id: string; name: string }>>([]);
  const [industryRoles, setIndustryRoles] = useState<Array<{ id: string; name: string }>>([]);
  const [techTools, setTechTools] = useState<Array<{ id: string; name: string }>>([]);
  const [annualRevenueOptions, setAnnualRevenueOptions] = useState<Array<{ id: string; name: string }>>([]);
  const [techSavvyOptions, setTechSavvyOptions] = useState<Array<{ id: string; name: string }>>([]);
  const [referralSources, setReferralSources] = useState<Array<{ id: string; name: string }>>([]);
  const [organizations, setOrganizations] = useState<Array<{ id: string; name: string }>>([]);
  const [interests, setInterests] = useState<Array<{ id: string; name: string }>>([]);

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

  // Initialize: Fetch reference tables and set defaults
  useEffect(() => {
    async function initialize() {
      try {
        // Auto-populate with defaults (using timestamp instead of runId)
        const timestamp = Date.now().toString().slice(-8);
        setFormData(prev => ({
          ...prev,
          company_name: `TestLab Company ${timestamp}`,
          address_line1: '123 Main Street',
          address_line2: '',
          city: 'Orlando',
          state: 'FL',
          zipcode: '32801',
          primaryContact_email: `test+newapp+${timestamp}@example.test`,
          primaryContact_phone: '5551231234',
        }));

        // Fetch reference tables
        await fetchReferenceTables();
      } catch (err: any) {
        console.error('Error initializing form:', err);
        setError('Failed to initialize form. Please refresh the page.');
      }
    }

    initialize();
    initializeGooglePlaces();
    getUserLocation();
  }, [scenarioId]);

  // Initialize Google Places API
  useEffect(() => {
    const checkGoogle = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        const service = new google.maps.places.AutocompleteService();
        setAutocompleteService(service);
        
        const dummyDiv = document.createElement('div');
        const places = new google.maps.places.PlacesService(dummyDiv);
        setPlacesService(places);
        clearInterval(checkGoogle);
      }
    }, 100);

    return () => clearInterval(checkGoogle);
  }, []);

  async function fetchReferenceTables() {
    try {
      const [
        bdRes,
        servicesRes,
        projectTypesRes,
        industryRolesRes,
        techToolsRes,
        annualRevenueRes,
        techSavvyRes,
        referralSourcesRes,
        organizationsRes,
        interestsRes,
      ] = await Promise.all([
        supabase.from('building_departments').select('id, name').is('deleted_at', null).order('name'),
        supabase.from('services').select('id, name').is('deleted_at', null).order('name'),
        supabase.from('project_types').select('id, name').order('name'),
        supabase.from('companies_industry_role_field').select('id, name').eq('active', true).order('name'),
        supabase.from('companies_tech_tools_field').select('id, name').eq('active', true).order('name'),
        supabase.from('companies_annual_revenue_field').select('id, name').eq('active', true).order('name'),
        supabase.from('companies_tech_savvy_field').select('id, name').eq('active', true).order('name'),
        supabase.from('companies_referral_source_field').select('id, name').eq('active', true).order('name'),
        supabase.from('companies_organization_field').select('id, name').eq('active', true).order('name'),
        supabase.from('companies_interest_field').select('id, name').eq('active', true).order('name'),
      ]);

      if (bdRes.data) setBuildingDepartments(bdRes.data);
      if (servicesRes.data) setServices(servicesRes.data);
      if (projectTypesRes.data) setProjectTypes(projectTypesRes.data);
      if (industryRolesRes.data) setIndustryRoles(industryRolesRes.data);
      if (techToolsRes.data) setTechTools(techToolsRes.data);
      if (annualRevenueRes.data) setAnnualRevenueOptions(annualRevenueRes.data);
      if (techSavvyRes.data) setTechSavvyOptions(techSavvyRes.data);
      if (referralSourcesRes.data) setReferralSources(referralSourcesRes.data);
      if (organizationsRes.data) setOrganizations(organizationsRes.data);
      if (interestsRes.data) setInterests(interestsRes.data);

      // Set default values after fetching reference tables
      setDefaultValues();
    } catch (err) {
      console.error('Error fetching reference tables:', err);
    }
  }

  function setDefaultValues() {
    setFormData(prev => ({
      ...prev,
      monthlyPermittedProjects: '2',
      annualRevenue: '019a79b4-48fc-7a82-d3cd-6475dc17966f',
      techSavvy: '019a79b8-155b-72bd-7d30-b14a24e63f37',
      employeeQuantity: '4',
      officeStaff: true,
      officeStaffQuantity: '2',
      fieldStaff: true,
      fieldStaffQuantity: '2',
      referralSourceId: '019a79b7-f3c6-7a82-cc1f-de247e6b516b',
      organizationId: '019a79b7-3c19-74ba-4830-fd9573666226',
      interestId: '019a79b5-3b34-7a85-18f1-bd9c8eeb3f40',
      interestDescription: 'TEST. We are very interested in hiring a private provider after we have heard so many good things about the process.',
      techDescription: 'TEST. We use a variety of software and custom built no code software to run our business.',
      buildingDepartments: ['767c97b5-b636-4155-ba26-d067028e166a'], // Lee County
      project_type_ids: ['019a9304-6154-7d97-f9a3-731fb9f0d5db'], // Single Family Aluminum Construction
      industryRole: ['019a79b4-87ab-728c-8182-0f0f1b6f347a'], // Contractor
      techTools: ['019a79b8-4bdd-70ab-8fd6-e6dc8681b105'],
      services: [
        '019a79c0-029a-7fad-1c68-aa026b5536dd',
        '019a79c0-0299-7db7-c3b4-36ffb2d15cc2',
        '019a79c0-0298-7681-ac4c-923fef5ded40'
      ], // All three services
      hasWebsite: false,
      isLicensed: false,
      primaryContact_firstName: '',
      primaryContact_lastName: '',
    }));
  }

  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setUserLocation({ lat: 27.7663, lng: -82.6404 });
        }
      );
    } else {
      setUserLocation({ lat: 27.7663, lng: -82.6404 });
    }
  }

  function initializeGooglePlaces() {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!googleMapsKey) {
        throw new Error('VITE_GOOGLE_MAPS_API_KEY is required');
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=places`;
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

  // Handle address search
  useEffect(() => {
    if (!addressSearch.trim() || !autocompleteService || !userLocation) {
      if (!addressSelected) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
      return;
    }

    if (addressSelected) {
      return;
    }

    const request: google.maps.places.AutocompletionRequest = {
      input: addressSearch,
      location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
      radius: 50000,
    };

    autocompleteService.getPlacePredictions(request, (predictions: google.maps.places.AutocompletePrediction[] | null, status: google.maps.places.PlacesServiceStatus) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        setSuggestions(predictions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    });
  }, [addressSearch, autocompleteService, userLocation, addressSelected]);

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

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSuggestions]);

  function fetchAddressSuggestions() {
    if (!addressSearch.trim() || !autocompleteService || !userLocation) {
      return;
    }

    const request: google.maps.places.AutocompletionRequest = {
      input: addressSearch,
      location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
      radius: 50000,
    };

    autocompleteService.getPlacePredictions(request, (predictions: google.maps.places.AutocompletePrediction[] | null, status: google.maps.places.PlacesServiceStatus) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        setSuggestions(predictions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    });
  }

  function handleAddressSelect(placeId: string, description?: string) {
    setShowSuggestions(false);
    setSuggestions([]);
    setAddressSelected(true);
    
    if (!placesService) {
      setTimeout(() => handleAddressSelect(placeId, description), 100);
      return;
    }

    if (description) {
      setAddressSearch(description);
    }

    const request: google.maps.places.PlaceDetailsRequest = {
      placeId,
      fields: ['address_components', 'formatted_address'],
    };

    placesService.getDetails(request, (place: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        const components = place.address_components || [];
        
        let addressLine1 = '';
        let addressLine2 = '';
        let city = '';
        let state = '';
        let zipcode = '';

        components.forEach((component: google.maps.GeocoderAddressComponent) => {
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

        setFormData(prev => ({
          ...prev,
          address_line1: addressLine1,
          address_line2: addressLine2,
          city: city,
          state: state || prev.state,
          zipcode: zipcode,
        }));
      } else {
        console.error('Error fetching place details:', status);
      }
    });
  }

  // AI Fill function
  async function handleAIFill() {
    setAiLoading(true);
    setFormDisabled(true);
    setError(null);
    setAiMessage(null);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      // Generate random letter and industry focus for variety
      const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z
      const industries = [
        'residential',
        'commercial',
        'industrial',
        'infrastructure',
        'renovation',
        'custom homes',
        'general contracting',
        'roofing',
        'electrical',
        'plumbing',
        'HVAC',
        'landscaping',
        'concrete',
        'framing'
      ];
      const randomIndustry = industries[Math.floor(Math.random() * industries.length)];

      // Generate entropy for phone number uniqueness (digits 4-6)
      const entropy = Math.floor(100 + Math.random() * 900); // 100–999

      const prompt = `Generate a realistic U.S. construction company and primary contact.

IMPORTANT CONSTRAINTS:
- Company name MUST start with the letter "${randomLetter.toUpperCase()}"
- Contact first name MUST start with the letter "${randomLetter.toUpperCase()}"
- Contact last name MUST start with the letter "${randomLetter.toUpperCase()}"
- Company should focus on ${randomIndustry} construction
- AVOID common/repetitive words like: Sunshine, Golden, Premier, Elite, Superior, Apex, Summit, Best, Top, First, Prime
- Use diverse, realistic naming patterns

Return strictly JSON with the following fields:

{
  "company": {
    "name": "",
    "address_line1": "",
    "address_line2": "",
    "city": "",
    "state": "FL",
    "zipcode": "",
    "hasWebsite": false,
    "website": null,
    "isLicensed": false,
    "licenseNumber": null
  },
  "contact": {
    "firstName": "",
    "lastName": "",
    "email": "",
    "phone": ""
  }
}

Rules:
- Create realistic but fake data.
- State must always be FL
- Phone must be a 10-digit U.S. phone number with no formatting.
- The phone number MUST include the sequence "${entropy}" as digits 4–6 of the number.
- Phone number structure:
    - Area code (digits 1–3): Choose a valid U.S. area code between 201–989
    - Middle digits (digits 4–6): MUST be exactly "${entropy}"
    - Last 4 digits (digits 7–10): Random number between 0000–9999
- CRITICAL: Avoid common or repeating patterns in the phone number:
    - DO NOT use sequential numbers like 1234, 2345, 3456, 5678, 6789, etc.
    - DO NOT use repeating digits like 1111, 2222, 3333, 0000, etc.
    - DO NOT use common test patterns like 1234, 0000, 1111, 9999, etc.
    - DO NOT use simple patterns like 1000, 2000, 3000, etc.
    - Use truly random, non-sequential, non-repeating combinations for the last 4 digits
    - Ensure the last 4 digits appear realistic and varied (e.g., 3847, 5921, 7163, not 1234 or 1111)
- Email must be valid.
- License info can be random or null.

Return ONLY the JSON, no explanation.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content?.trim();
      
      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      // Extract JSON from response (handle cases where there might be markdown code blocks)
      let jsonContent = content;
      if (content.startsWith('```')) {
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonContent = jsonMatch[1];
        }
      }

      const aiData = JSON.parse(jsonContent);

      // Populate form with AI data
      setFormData(prev => ({
        ...prev,
        company_name: aiData.company?.name || prev.company_name,
        address_line1: aiData.company?.address_line1 || prev.address_line1,
        address_line2: aiData.company?.address_line2 || prev.address_line2,
        city: aiData.company?.city || prev.city,
        state: aiData.company?.state || 'FL',
        zipcode: aiData.company?.zipcode || prev.zipcode,
        hasWebsite: aiData.company?.hasWebsite || false,
        website: aiData.company?.website || '',
        isLicensed: aiData.company?.isLicensed || false,
        licenseNumber: aiData.company?.licenseNumber || '',
        primaryContact_firstName: aiData.contact?.firstName || prev.primaryContact_firstName,
        primaryContact_lastName: aiData.contact?.lastName || prev.primaryContact_lastName,
        primaryContact_email: aiData.contact?.email || prev.primaryContact_email,
        primaryContact_phone: aiData.contact?.phone || prev.primaryContact_phone,
      }));

      setAiMessage({ type: 'success', message: 'AI data loaded successfully.' });
      setTimeout(() => setAiMessage(null), 5000);
    } catch (err: any) {
      console.error('Error with AI fill:', err);
      
      // Fallback to defaults (using timestamp instead of runId)
      const timestamp = Date.now().toString().slice(-8);
      setFormData(prev => ({
        ...prev,
        company_name: `TestLab Company ${timestamp}`,
        primaryContact_firstName: 'Test',
        primaryContact_lastName: 'Client',
        primaryContact_email: `test+newapp+${timestamp}@example.test`,
        primaryContact_phone: '5551231234',
      }));

      setAiMessage({ type: 'error', message: 'Failed to retrieve AI-generated data. Using default test values.' });
      setTimeout(() => setAiMessage(null), 5000);
    } finally {
      setAiLoading(false);
      setFormDisabled(false);
    }
  }

  // Multi-select handlers
  function handleClearAndRunAgain() {
    // Reset form state
    setFormData({
      company_name: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: 'FL',
      zipcode: '',
      hasWebsite: false,
      website: '',
      isLicensed: false,
      licenseNumber: '',
      monthlyPermittedProjects: '',
      annualRevenue: '',
      techSavvy: '',
      techDescription: '',
      employeeQuantity: '',
      officeStaff: false,
      officeStaffQuantity: '',
      fieldStaff: false,
      fieldStaffQuantity: '',
      referralSourceId: '',
      previousPrivateProvider: false,
      previousPPName: '',
      organizationId: '',
      interestId: '',
      interestDescription: '',
      buildingDepartments: [],
      project_type_ids: [],
      industryRole: [],
      techTools: [],
      services: [],
      primaryContact_firstName: '',
      primaryContact_lastName: '',
      primaryContact_email: '',
      primaryContact_phone: '',
      primaryContact_phoneExtension: '',
    });
    setAdditionalContacts([]);
    setError(null);
    setResults(null);
    setServicesError(null);
    setFormCollapsed(false);
    setAddressSearch('');
    setAddressSelected(false);
    setRunId(null); // Reset runId so a new one will be created on next submit
    setCreatedEntities(null);

    // Re-initialize with defaults (using timestamp instead of runId)
    const timestamp = Date.now().toString().slice(-8);
    setFormData(prev => ({
      ...prev,
      company_name: `TestLab Company ${timestamp}`,
      address_line1: '123 Main Street',
      address_line2: '',
      city: 'Orlando',
      state: 'FL',
      zipcode: '32801',
      primaryContact_email: `test+newapp+${timestamp}@example.test`,
      primaryContact_phone: '5551231234',
    }));

    // Set default values after a short delay to ensure reference tables are loaded
    setTimeout(() => {
      setDefaultValues();
    }, 100);
  }

  // Handle service selection with Plan Review -> Inspections dependency
  function handleServicesChange(newServiceIds: string[]) {
    setServicesError(null);

    const planReviewService = services.find(s => s.name === 'Plan Review');
    const inspectionsService = services.find(s => s.name === 'Inspections');
    
    if (!planReviewService || !inspectionsService) {
      // If services aren't loaded, just update normally
      setFormData(prev => ({ ...prev, services: newServiceIds }));
      return;
    }

    const planReviewId = planReviewService.id;
    const inspectionsId = inspectionsService.id;
    
    const wasPlanReviewSelected = formData.services.includes(planReviewId);
    const isPlanReviewSelected = newServiceIds.includes(planReviewId);
    const wasInspectionsSelected = formData.services.includes(inspectionsId);
    const isInspectionsSelected = newServiceIds.includes(inspectionsId);

    // Check if user is trying to deselect Inspections while Plan Review is selected
    if (isPlanReviewSelected && wasInspectionsSelected && !isInspectionsSelected) {
      // Show error and prevent the change by restoring previous state
      setServicesError('Plan Review cannot be selected without Inspections');
      // Restore Inspections to the selection
      const restoredServiceIds = [...newServiceIds, inspectionsId];
      setFormData(prev => ({ ...prev, services: restoredServiceIds }));
      return;
    }

    // If Plan Review is being added, ensure Inspections is also included
    if (isPlanReviewSelected && !wasPlanReviewSelected) {
      if (!newServiceIds.includes(inspectionsId)) {
        newServiceIds = [...newServiceIds, inspectionsId];
      }
    }

    // If Plan Review is being removed, also remove Inspections
    if (!isPlanReviewSelected && wasPlanReviewSelected) {
      newServiceIds = newServiceIds.filter(id => id !== inspectionsId);
    }

    setFormData(prev => ({ ...prev, services: newServiceIds }));
  }

  // Additional contacts handlers
  function addAdditionalContact() {
    setAdditionalContacts(prev => [...prev, {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      phoneExtension: '',
    }]);
  }

  function removeAdditionalContact(index: number) {
    setAdditionalContacts(prev => prev.filter((_, i) => i !== index));
  }

  function updateAdditionalContact(index: number, field: keyof AdditionalContact, value: string) {
    setAdditionalContacts(prev => prev.map((contact, i) => 
      i === index ? { ...contact, [field]: value } : contact
    ));
  }

  // Submit handler
  async function handleSubmit(e?: React.FormEvent) {
    if (e) {
      e.preventDefault();
    }

    // Create test run only when submitting
    if (!runId) {
      try {
        const user = await getCurrentUser();
        const runBy = user?.id || null;
        const newRunId = await createTestRun(scenarioId, runBy);
        setRunId(newRunId);
      } catch (err: any) {
        console.error('Error creating test run:', err);
        setError('Failed to create test run. Please try again.');
        return;
      }
    }

    // Validate required fields
    if (!formData.company_name.trim()) {
      setError('Company name is required');
      return;
    }

    if (!formData.address_line1.trim()) {
      setError('Address Line 1 is required');
      return;
    }

    if (!formData.city.trim()) {
      setError('City is required');
      return;
    }

    if (!formData.state.trim()) {
      setError('State is required');
      return;
    }

    if (!formData.zipcode.trim()) {
      setError('Zipcode is required');
      return;
    }

    if (!formData.primaryContact_firstName.trim()) {
      setError('Primary contact first name is required');
      return;
    }

    if (!formData.primaryContact_lastName.trim()) {
      setError('Primary contact last name is required');
      return;
    }

    if (!formData.primaryContact_email.trim()) {
      setError('Primary contact email is required');
      return;
    }

    if (!formData.primaryContact_phone.trim()) {
      setError('Primary contact phone is required');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.primaryContact_email)) {
      setError('Invalid email format');
      return;
    }

    // Validate phone (min 10 characters)
    if (formData.primaryContact_phone.replace(/\D/g, '').length < 10) {
      setError('Phone number must be at least 10 digits');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResults(null);

      // Get current user for runBy (runId already created above)
      const user = await getCurrentUser();
      const runBy = user?.id || null;

      // Build full address string
      const addressParts = [formData.address_line1];
      if (formData.address_line2?.trim()) {
        addressParts.push(formData.address_line2);
      }
      addressParts.push(formData.city);
      addressParts.push(`${formData.state} ${formData.zipcode}`);
      const fullAddress = addressParts.join(', ');

      // Build payload
      console.log('[NewApplicationForm] Building payload for apply_form_submitted:', {
        testRunId: runId,
        scenarioId: scenarioId,
        runBy: runBy,
        hasRunId: !!runId,
        hasScenarioId: !!scenarioId
      });
      
      const payload = {
        testRunId: runId,
        scenarioId: scenarioId,
        runBy: runBy,
        companyData: {
          name: formData.company_name,
          address: fullAddress,
          hasWebsite: formData.hasWebsite,
          website: formData.hasWebsite && formData.website ? formData.website : null,
          isLicensed: formData.isLicensed,
          licenseNumber: formData.isLicensed && formData.licenseNumber ? formData.licenseNumber : null,
          monthlyPermittedProjects: formData.monthlyPermittedProjects ? formData.monthlyPermittedProjects : null,
          annualRevenue: formData.annualRevenue || null,
          techSavvy: formData.techSavvy || null,
          techDescription: formData.techDescription || null,
          employeeQuantity: formData.employeeQuantity ? formData.employeeQuantity : null,
          officeStaff: formData.officeStaff,
          officeStaffQuantity: formData.officeStaff && formData.officeStaffQuantity ? formData.officeStaffQuantity : null,
          fieldStaff: formData.fieldStaff,
          fieldStaffQuantity: formData.fieldStaff && formData.fieldStaffQuantity ? formData.fieldStaffQuantity : null,
          referralSourceId: formData.referralSourceId || null,
          previousPrivateProvider: formData.previousPrivateProvider,
          previousPPName: formData.previousPrivateProvider && formData.previousPPName ? formData.previousPPName : null,
          organizationId: formData.organizationId || null,
          interestId: formData.interestId || null,
          interestDescription: formData.interestDescription || null,
          buildingDepartments: formData.buildingDepartments.length > 0 ? formData.buildingDepartments : undefined,
          project_type_ids: formData.project_type_ids.length > 0 ? formData.project_type_ids : undefined,
          industryRole: formData.industryRole.length > 0 ? formData.industryRole : undefined,
          techTools: formData.techTools.length > 0 ? formData.techTools : undefined,
          services: formData.services.length > 0 ? formData.services : [],
        },
        contactData: {
          primaryContact: {
            firstName: formData.primaryContact_firstName,
            lastName: formData.primaryContact_lastName,
            email: formData.primaryContact_email,
            phone: formData.primaryContact_phone,
            phoneExtension: formData.primaryContact_phoneExtension || '',
          },
          additionalContacts: additionalContacts.length > 0 ? additionalContacts.map(contact => ({
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            phone: contact.phone,
            phoneExtension: contact.phoneExtension || '',
          })) : [],
        },
      };

      // Call edge function
      const { data, error: funcError } = await callEdgeFunction('apply_form_submitted', payload);

      if (funcError) throw funcError;
      setResults(data);
      
      // Extract created entity IDs from response
      const responseData = data?.data || data;
      const created: CreatedApplicationEntities = {
        companyId: responseData?.companyId ?? null,
        primaryContactId: responseData?.primaryContactId ?? null,
        additionalContactIds: responseData?.additionalContactIds ?? [],
        dealId: responseData?.dealId ?? null,
        licenseId: responseData?.licenseId ?? null,
      };
      setCreatedEntities(created);
      setFormCollapsed(true);
    } catch (err: any) {
      console.error('Error executing scenario:', err);
      setError(err.message || 'Failed to execute scenario');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with AI Fill button */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-fcc-white/70 mb-4">
            This scenario creates a new company, contact, and deal using the apply_form_submitted edge function.
          </p>
        </div>
        <div className="flex flex-col items-end">
          <PrimaryButton
            type="button"
            onClick={handleAIFill}
            disabled={aiLoading || formDisabled}
            className="flex items-center space-x-2"
          >
            {aiLoading ? (
              <>
                <LoadingSpinner />
                <span>AI is generating...</span>
              </>
            ) : (
              <>
                <img src={chatgptLogo} alt="ChatGPT" className="w-5 h-5" />
                <span>Fill with AI</span>
              </>
            )}
          </PrimaryButton>
          
          {/* AI Fill Messages */}
          {aiMessage && (
            <div className={`mt-2 bg-fcc-dark border rounded-lg p-3 ${
              aiMessage.type === 'success' 
                ? 'border-green-500' 
                : 'border-red-500'
            }`}>
              <div className="flex items-center space-x-2">
                <StatusBadge status={aiMessage.type === 'success' ? 'success' : 'failed'} />
                <span className={`text-sm ${
                  aiMessage.type === 'success' 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {aiMessage.message}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {!formCollapsed && (
        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information Section */}
        <div className="bg-fcc-dark rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-fcc-white mb-4">Company Information</h3>
          
          <StyledInput
            label="Company Name *"
            value={formData.company_name}
            onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
            required
            disabled={formDisabled}
          />

          {/* Address Search */}
          <div className="relative" ref={suggestionsRef}>
            <label className="block text-sm text-fcc-white/70 mb-2">Search Address *</label>
            <input
              ref={addressInputRef}
              type="text"
              value={addressSearch}
              onChange={(e) => {
                setAddressSearch(e.target.value);
                if (addressSelected) {
                  setAddressSelected(false);
                }
              }}
              onFocus={() => {
                if (addressSearch.trim()) {
                  fetchAddressSuggestions();
                }
              }}
              placeholder="Start typing an address..."
              disabled={formDisabled}
              className="w-full bg-fcc-black border border-fcc-divider rounded-lg px-4 py-2 text-fcc-white placeholder-fcc-white/50 focus:outline-none focus:ring-2 focus:ring-fcc-cyan focus:border-transparent disabled:opacity-50"
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
                      if (addressInputRef.current) {
                        addressInputRef.current.blur();
                      }
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className="w-full text-left px-4 py-2 text-fcc-white hover:bg-fcc-divider transition-colors"
                  >
                    <div className="font-medium">{suggestion.structured_formatting.main_text}</div>
                    <div className="text-sm text-fcc-white/70">{suggestion.structured_formatting.secondary_text}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Address fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StyledInput
              label="Address Line 1 *"
              value={formData.address_line1}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, address_line1: e.target.value }));
                setAddressSearch(e.target.value);
              }}
              required
              disabled={formDisabled}
            />
            <StyledInput
              label="Address Line 2"
              value={formData.address_line2}
              onChange={(e) => setFormData(prev => ({ ...prev, address_line2: e.target.value }))}
              disabled={formDisabled}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StyledInput
              label="City *"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              required
              disabled={formDisabled}
            />
            <StyledInput
              label="State *"
              value={formData.state}
              onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
              required
              disabled={formDisabled}
            />
            <StyledInput
              label="Zipcode *"
              value={formData.zipcode}
              onChange={(e) => setFormData(prev => ({ ...prev, zipcode: e.target.value }))}
              required
              disabled={formDisabled}
            />
          </div>

          {/* Website */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.hasWebsite}
              onChange={(e) => setFormData(prev => ({ ...prev, hasWebsite: e.target.checked }))}
              disabled={formDisabled}
              className="w-5 h-5 rounded border-fcc-divider bg-fcc-black text-fcc-cyan focus:ring-2 focus:ring-fcc-cyan"
            />
            <label className="text-fcc-white">Has Website</label>
          </div>
          {formData.hasWebsite && (
            <StyledInput
              label="Website URL"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              disabled={formDisabled}
            />
          )}

          {/* Licensed */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.isLicensed}
              onChange={(e) => setFormData(prev => ({ ...prev, isLicensed: e.target.checked }))}
              disabled={formDisabled}
              className="w-5 h-5 rounded border-fcc-divider bg-fcc-black text-fcc-cyan focus:ring-2 focus:ring-fcc-cyan"
            />
            <label className="text-fcc-white">Is Licensed</label>
          </div>
          {formData.isLicensed && (
            <StyledInput
              label="License Number"
              value={formData.licenseNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
              disabled={formDisabled}
            />
          )}
        </div>

        {/* Company Details Section */}
        <div className="bg-fcc-dark rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-fcc-white mb-4">Company Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StyledInput
              label="Monthly Permitted Projects"
              type="number"
              value={formData.monthlyPermittedProjects}
              onChange={(e) => setFormData(prev => ({ ...prev, monthlyPermittedProjects: e.target.value }))}
              disabled={formDisabled}
            />
            <StyledSelect
              label="Annual Revenue"
              value={formData.annualRevenue}
              onChange={(e) => setFormData(prev => ({ ...prev, annualRevenue: e.target.value }))}
              options={[
                { value: '', label: 'Select...' },
                ...annualRevenueOptions.map(opt => ({ value: opt.id, label: opt.name }))
              ]}
              disabled={formDisabled}
            />
            <StyledSelect
              label="Tech Savvy"
              value={formData.techSavvy}
              onChange={(e) => setFormData(prev => ({ ...prev, techSavvy: e.target.value }))}
              options={[
                { value: '', label: 'Select...' },
                ...techSavvyOptions.map(opt => ({ value: opt.id, label: opt.name }))
              ]}
              disabled={formDisabled}
            />
            <StyledInput
              label="Employee Quantity"
              type="number"
              value={formData.employeeQuantity}
              onChange={(e) => setFormData(prev => ({ ...prev, employeeQuantity: e.target.value }))}
              disabled={formDisabled}
            />
          </div>

          <StyledTextarea
            label="Tech Description"
            value={formData.techDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, techDescription: e.target.value }))}
            disabled={formDisabled}
            rows={3}
          />

          {/* Office Staff */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.officeStaff}
              onChange={(e) => setFormData(prev => ({ ...prev, officeStaff: e.target.checked }))}
              disabled={formDisabled}
              className="w-5 h-5 rounded border-fcc-divider bg-fcc-black text-fcc-cyan focus:ring-2 focus:ring-fcc-cyan"
            />
            <label className="text-fcc-white">Has Office Staff</label>
          </div>
          {formData.officeStaff && (
            <StyledInput
              label="Office Staff Quantity"
              type="number"
              value={formData.officeStaffQuantity}
              onChange={(e) => setFormData(prev => ({ ...prev, officeStaffQuantity: e.target.value }))}
              disabled={formDisabled}
            />
          )}

          {/* Field Staff */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.fieldStaff}
              onChange={(e) => setFormData(prev => ({ ...prev, fieldStaff: e.target.checked }))}
              disabled={formDisabled}
              className="w-5 h-5 rounded border-fcc-divider bg-fcc-black text-fcc-cyan focus:ring-2 focus:ring-fcc-cyan"
            />
            <label className="text-fcc-white">Has Field Staff</label>
          </div>
          {formData.fieldStaff && (
            <StyledInput
              label="Field Staff Quantity"
              type="number"
              value={formData.fieldStaffQuantity}
              onChange={(e) => setFormData(prev => ({ ...prev, fieldStaffQuantity: e.target.value }))}
              disabled={formDisabled}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StyledSelect
              label="Referral Source"
              value={formData.referralSourceId}
              onChange={(e) => setFormData(prev => ({ ...prev, referralSourceId: e.target.value }))}
              options={[
                { value: '', label: 'Select...' },
                ...referralSources.map(opt => ({ value: opt.id, label: opt.name }))
              ]}
              disabled={formDisabled}
            />
            <StyledSelect
              label="Organization"
              value={formData.organizationId}
              onChange={(e) => setFormData(prev => ({ ...prev, organizationId: e.target.value }))}
              options={[
                { value: '', label: 'Select...' },
                ...organizations.map(opt => ({ value: opt.id, label: opt.name }))
              ]}
              disabled={formDisabled}
            />
            <StyledSelect
              label="Interest"
              value={formData.interestId}
              onChange={(e) => setFormData(prev => ({ ...prev, interestId: e.target.value }))}
              options={[
                { value: '', label: 'Select...' },
                ...interests.map(opt => ({ value: opt.id, label: opt.name }))
              ]}
              disabled={formDisabled}
            />
          </div>

          <StyledTextarea
            label="Interest Description"
            value={formData.interestDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, interestDescription: e.target.value }))}
            disabled={formDisabled}
            rows={3}
          />

          {/* Previous Private Provider */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.previousPrivateProvider}
              onChange={(e) => setFormData(prev => ({ ...prev, previousPrivateProvider: e.target.checked }))}
              disabled={formDisabled}
              className="w-5 h-5 rounded border-fcc-divider bg-fcc-black text-fcc-cyan focus:ring-2 focus:ring-fcc-cyan"
            />
            <label className="text-fcc-white">Previous Private Provider</label>
          </div>
          {formData.previousPrivateProvider && (
            <StyledInput
              label="Previous PP Name"
              value={formData.previousPPName}
              onChange={(e) => setFormData(prev => ({ ...prev, previousPPName: e.target.value }))}
              disabled={formDisabled}
            />
          )}
        </div>

        {/* Multi-Select Sections */}
        <div className="bg-fcc-dark rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-semibold text-fcc-white mb-4">Company Associations</h3>

          {/* Building Departments */}
          <SearchableMultiSelect
            label="Building Departments"
            values={formData.buildingDepartments}
            onChange={(values) => setFormData(prev => ({ ...prev, buildingDepartments: values }))}
            options={buildingDepartments.map(dept => ({ value: dept.id, label: dept.name }))}
            disabled={formDisabled}
            placeholder="Select building departments..."
          />

          {/* Project Types */}
          <SearchableMultiSelect
            label="Project Types"
            values={formData.project_type_ids}
            onChange={(values) => setFormData(prev => ({ ...prev, project_type_ids: values }))}
            options={projectTypes.map(type => ({ value: type.id, label: type.name }))}
            disabled={formDisabled}
            placeholder="Select project types..."
          />

          {/* Industry Roles */}
          <SearchableMultiSelect
            label="Industry Roles"
            values={formData.industryRole}
            onChange={(values) => setFormData(prev => ({ ...prev, industryRole: values }))}
            options={industryRoles.map(role => ({ value: role.id, label: role.name }))}
            disabled={formDisabled}
            placeholder="Select industry roles..."
          />

          {/* Tech Tools */}
          <SearchableMultiSelect
            label="Tech Tools"
            values={formData.techTools}
            onChange={(values) => setFormData(prev => ({ ...prev, techTools: values }))}
            options={techTools.map(tool => ({ value: tool.id, label: tool.name }))}
            disabled={formDisabled}
            placeholder="Select tech tools..."
          />

          {/* Services */}
          <SearchableMultiSelect
            label="Services *"
            values={formData.services}
            onChange={handleServicesChange}
            options={services.map(service => ({ value: service.id, label: service.name }))}
            disabled={formDisabled}
            placeholder="Select services..."
            required
            error={servicesError || undefined}
          />
        </div>

        {/* Primary Contact Section */}
        <div className="bg-fcc-dark rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-fcc-white mb-4">Primary Contact</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StyledInput
              label="First Name *"
              value={formData.primaryContact_firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, primaryContact_firstName: e.target.value }))}
              required
              disabled={formDisabled}
            />
            <StyledInput
              label="Last Name *"
              value={formData.primaryContact_lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, primaryContact_lastName: e.target.value }))}
              required
              disabled={formDisabled}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StyledInput
              label="Email *"
              type="email"
              value={formData.primaryContact_email}
              onChange={(e) => setFormData(prev => ({ ...prev, primaryContact_email: e.target.value }))}
              required
              disabled={formDisabled}
            />
            <StyledInput
              label="Phone *"
              type="tel"
              value={formData.primaryContact_phone}
              onChange={(e) => setFormData(prev => ({ ...prev, primaryContact_phone: e.target.value }))}
              required
              disabled={formDisabled}
            />
          </div>

          <StyledInput
            label="Phone Extension"
            value={formData.primaryContact_phoneExtension}
            onChange={(e) => setFormData(prev => ({ ...prev, primaryContact_phoneExtension: e.target.value }))}
            disabled={formDisabled}
          />
        </div>

        {/* Additional Contacts Section */}
        <div className="bg-fcc-dark rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-fcc-white">Additional Contacts</h3>
            <PrimaryButton
              type="button"
              onClick={addAdditionalContact}
              disabled={formDisabled}
            >
              Add Contact
            </PrimaryButton>
          </div>

          {additionalContacts.map((contact, index) => (
            <div key={index} className="border border-fcc-divider rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-fcc-white font-medium">Contact {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeAdditionalContact(index)}
                  disabled={formDisabled}
                  className="text-red-400 hover:text-red-300 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StyledInput
                  label="First Name"
                  value={contact.firstName}
                  onChange={(e) => updateAdditionalContact(index, 'firstName', e.target.value)}
                  disabled={formDisabled}
                />
                <StyledInput
                  label="Last Name"
                  value={contact.lastName}
                  onChange={(e) => updateAdditionalContact(index, 'lastName', e.target.value)}
                  disabled={formDisabled}
                />
                <StyledInput
                  label="Email"
                  type="email"
                  value={contact.email}
                  onChange={(e) => updateAdditionalContact(index, 'email', e.target.value)}
                  disabled={formDisabled}
                />
                <StyledInput
                  label="Phone"
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => updateAdditionalContact(index, 'phone', e.target.value)}
                  disabled={formDisabled}
                />
                <StyledInput
                  label="Phone Extension"
                  value={contact.phoneExtension}
                  onChange={(e) => updateAdditionalContact(index, 'phoneExtension', e.target.value)}
                  disabled={formDisabled}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <PrimaryButton type="submit" disabled={loading || formDisabled}>
          {loading ? 'Submitting...' : 'Run Scenario'}
        </PrimaryButton>

        {loading && (
          <div className="flex items-center space-x-4">
            <LoadingSpinner />
            <span className="text-fcc-white">Executing scenario...</span>
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
      )}

      {formCollapsed && results && runId && (
        <div className="mb-6 rounded-xl border border-green-500 bg-green-950/30 p-4">
          <div className="font-semibold text-green-400 mb-2">
            Application Submitted
          </div>

          <div className="text-xs text-zinc-200 space-y-1">
            <div>
              <span className="font-mono">Run ID:</span>{' '}
              <span className="font-mono">{runId}</span>
            </div>

            {createdEntities?.companyId && (
              <div>
                <span className="font-mono">Company ID:</span>{' '}
                <span className="font-mono">{createdEntities.companyId}</span>
              </div>
            )}

            {createdEntities?.primaryContactId && (
              <div>
                <span className="font-mono">Primary Contact ID:</span>{' '}
                <span className="font-mono">{createdEntities.primaryContactId}</span>
              </div>
            )}

            {createdEntities?.additionalContactIds?.length ? (
              <div>
                <span className="font-mono">Additional Contact IDs:</span>
                <ul className="ml-4 list-disc">
                  {createdEntities.additionalContactIds.map(id => (
                    <li key={id} className="font-mono">{id}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {createdEntities?.dealId && (
              <div>
                <span className="font-mono">Deal ID:</span>{' '}
                <span className="font-mono">{createdEntities.dealId}</span>
              </div>
            )}

            {createdEntities?.licenseId && (
              <div>
                <span className="font-mono">License ID:</span>{' '}
                <span className="font-mono">{createdEntities.licenseId}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
            onClick={handleClearAndRunAgain}
          >
            Clear and Run Again
          </button>
        </div>
      )}
    </div>
  );
}
