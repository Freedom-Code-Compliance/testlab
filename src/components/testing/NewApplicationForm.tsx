import { useState, useEffect, useRef } from 'react';
import { createTestRun, callEdgeFunction, getCurrentUser, supabase } from '../../lib/supabase';
import StyledInput from '../ui/StyledInput';
import StyledSelect from '../ui/StyledSelect';
import StyledTextarea from '../ui/StyledTextarea';
import PrimaryButton from '../ui/PrimaryButton';
import LoadingSpinner from '../ui/LoadingSpinner';
import StatusBadge from '../ui/StatusBadge';

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

export default function NewApplicationForm({ scenarioId }: NewApplicationFormProps) {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formDisabled, setFormDisabled] = useState(false);

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
    workTypes: [] as string[],
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
  const [workTypes, setWorkTypes] = useState<Array<{ id: string; name: string }>>([]);
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

  // Initialize: Create test run and fetch reference tables
  useEffect(() => {
    async function initialize() {
      try {
        // Get current user
        const user = await getCurrentUser();
        const runBy = user?.id || null;

        // Create test run early
        const newRunId = await createTestRun(scenarioId, runBy);
        setRunId(newRunId);

        // Auto-populate with defaults
        const shortRunId = newRunId.slice(0, 8);
        setFormData(prev => ({
          ...prev,
          company_name: `TestLab Company ${shortRunId}`,
          address_line1: '123 Main Street',
          address_line2: '',
          city: 'Orlando',
          state: 'FL',
          zipcode: '32801',
          primaryContact_email: `test+newapp+${newRunId}@example.test`,
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
        workTypesRes,
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
        supabase.from('companies_work_types_field').select('id, name').eq('active', true).order('name'),
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
      if (workTypesRes.data) setWorkTypes(workTypesRes.data);
      if (industryRolesRes.data) setIndustryRoles(industryRolesRes.data);
      if (techToolsRes.data) setTechTools(techToolsRes.data);
      if (annualRevenueRes.data) setAnnualRevenueOptions(annualRevenueRes.data);
      if (techSavvyRes.data) setTechSavvyOptions(techSavvyRes.data);
      if (referralSourcesRes.data) setReferralSources(referralSourcesRes.data);
      if (organizationsRes.data) setOrganizations(organizationsRes.data);
      if (interestsRes.data) setInterests(interestsRes.data);
    } catch (err) {
      console.error('Error fetching reference tables:', err);
    }
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
    if (!runId) {
      setError('Test run not initialized. Please refresh the page.');
      return;
    }

    setAiLoading(true);
    setFormDisabled(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const prompt = `Generate a realistic U.S. construction company and primary contact.

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
          model: 'gpt-4o-mini', // Using gpt-4o-mini as gpt-5-nano may not be available
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

      setSuccessMessage('AI data loaded successfully.');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('Error with AI fill:', err);
      
      // Fallback to defaults
      const shortRunId = runId.slice(0, 8);
      setFormData(prev => ({
        ...prev,
        company_name: `TestLab Company ${shortRunId}`,
        primaryContact_firstName: 'Test',
        primaryContact_lastName: 'Client',
        primaryContact_email: `test+newapp+${runId}@example.test`,
        primaryContact_phone: '5551231234',
      }));

      setError('Failed to retrieve AI-generated data. Using default test values.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setAiLoading(false);
      setFormDisabled(false);
    }
  }

  // Multi-select handlers
  function handleMultiSelectToggle(field: 'buildingDepartments' | 'workTypes' | 'industryRole' | 'techTools' | 'services', id: string) {
    setFormData(prev => {
      const current = prev[field] as string[];
      const updated = current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id];
      return { ...prev, [field]: updated };
    });
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

    if (!runId) {
      setError('Test run not initialized. Please refresh the page.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResults(null);
      setSuccessMessage(null);

      // Get current user for runBy
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
          workTypes: formData.workTypes.length > 0 ? formData.workTypes : undefined,
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
      setSuccessMessage('Application submitted successfully!');
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
            <span>Fill with AI</span>
          )}
        </PrimaryButton>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="bg-fcc-dark border border-green-500 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <StatusBadge status="success" />
            <span className="text-green-400">{successMessage}</span>
          </div>
        </div>
      )}

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
          <div className="space-y-2">
            <label className="block text-sm text-fcc-white/70 mb-2">Building Departments</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {buildingDepartments.map((dept) => (
                <label
                  key={dept.id}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-fcc-black/50 p-2 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.buildingDepartments.includes(dept.id)}
                    onChange={() => handleMultiSelectToggle('buildingDepartments', dept.id)}
                    disabled={formDisabled}
                    className="w-5 h-5 rounded border-fcc-divider bg-fcc-black text-fcc-cyan focus:ring-2 focus:ring-fcc-cyan"
                  />
                  <span className="text-fcc-white">{dept.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Work Types */}
          <div className="space-y-2">
            <label className="block text-sm text-fcc-white/70 mb-2">Work Types</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {workTypes.map((type) => (
                <label
                  key={type.id}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-fcc-black/50 p-2 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.workTypes.includes(type.id)}
                    onChange={() => handleMultiSelectToggle('workTypes', type.id)}
                    disabled={formDisabled}
                    className="w-5 h-5 rounded border-fcc-divider bg-fcc-black text-fcc-cyan focus:ring-2 focus:ring-fcc-cyan"
                  />
                  <span className="text-fcc-white">{type.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Industry Roles */}
          <div className="space-y-2">
            <label className="block text-sm text-fcc-white/70 mb-2">Industry Roles</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {industryRoles.map((role) => (
                <label
                  key={role.id}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-fcc-black/50 p-2 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.industryRole.includes(role.id)}
                    onChange={() => handleMultiSelectToggle('industryRole', role.id)}
                    disabled={formDisabled}
                    className="w-5 h-5 rounded border-fcc-divider bg-fcc-black text-fcc-cyan focus:ring-2 focus:ring-fcc-cyan"
                  />
                  <span className="text-fcc-white">{role.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tech Tools */}
          <div className="space-y-2">
            <label className="block text-sm text-fcc-white/70 mb-2">Tech Tools</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {techTools.map((tool) => (
                <label
                  key={tool.id}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-fcc-black/50 p-2 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.techTools.includes(tool.id)}
                    onChange={() => handleMultiSelectToggle('techTools', tool.id)}
                    disabled={formDisabled}
                    className="w-5 h-5 rounded border-fcc-divider bg-fcc-black text-fcc-cyan focus:ring-2 focus:ring-fcc-cyan"
                  />
                  <span className="text-fcc-white">{tool.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-2">
            <label className="block text-sm text-fcc-white/70 mb-2">Services *</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {services.map((service) => (
                <label
                  key={service.id}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-fcc-black/50 p-2 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service.id)}
                    onChange={() => handleMultiSelectToggle('services', service.id)}
                    disabled={formDisabled}
                    className="w-5 h-5 rounded border-fcc-divider bg-fcc-black text-fcc-cyan focus:ring-2 focus:ring-fcc-cyan"
                  />
                  <span className="text-fcc-white">{service.name}</span>
                </label>
              ))}
            </div>
          </div>
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

        {results && runId && (
          <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-4 space-y-4">
            <div className="flex items-center space-x-2">
              <StatusBadge status="success" />
              <span className="text-fcc-white font-semibold">Scenario Completed</span>
            </div>

            <div>
              <p className="text-sm text-fcc-white/70 mb-1">Run ID:</p>
              <p className="text-fcc-white font-mono text-sm">{runId}</p>
            </div>

            {results.data && (
              <div>
                <p className="text-sm text-fcc-white/70 mb-2">Records Created:</p>
                <div className="space-y-2">
                  {results.data.companyId && (
                    <p className="text-fcc-white">Company ID: <span className="font-mono text-sm">{results.data.companyId}</span></p>
                  )}
                  {results.data.primaryContactId && (
                    <p className="text-fcc-white">Primary Contact ID: <span className="font-mono text-sm">{results.data.primaryContactId}</span></p>
                  )}
                  {results.data.dealId && (
                    <p className="text-fcc-white">Deal ID: <span className="font-mono text-sm">{results.data.dealId}</span></p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
