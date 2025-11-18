import { useState, useEffect, useRef } from 'react';
import { createTestRun, callEdgeFunction } from '../../lib/supabase';
import PrimaryButton from '../ui/PrimaryButton';
import LoadingSpinner from '../ui/LoadingSpinner';
import StatusBadge from '../ui/StatusBadge';
import { X } from 'lucide-react';

interface MondayProjectFormProps {
  scenarioId: string;
}

const COMPLETED_PROJECTS_2_BOARD = '18369402312';
const PLAN_SETS_BOARD = '5307810845';

interface MondayItem {
  id: string;
  name: string;
  column_values: Array<{ id: string; text: string; value: string; type: string }>;
}

interface MondayFile {
  id: string;
  name: string;
  url: string;
  type: string;
}

export default function MondayProjectForm({ scenarioId }: MondayProjectFormProps) {
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [mondayItems, setMondayItems] = useState<MondayItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MondayItem | null>(null);
  const [planSetFiles, setPlanSetFiles] = useState<MondayFile[]>([]);
  const [showMapping, setShowMapping] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAllMondayProjects();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function fetchAllMondayProjects() {
    try {
      setSearching(true);
      // Call through edge function to avoid CORS issues
      const { data, error: funcError } = await callEdgeFunction('monday_fetch_projects', {
        board_id: COMPLETED_PROJECTS_2_BOARD,
        limit: 500,
      });

      if (funcError) throw funcError;
      if (data?.error) throw new Error(data.error);

      const items = data?.items || [];
      setMondayItems(items);
    } catch (err: any) {
      console.error('Error fetching Monday projects:', err);
      setError(err.message || 'Failed to fetch Monday.com projects');
      setMondayItems([]);
    } finally {
      setSearching(false);
    }
  }

  function filterItems(query: string) {
    if (!query.trim()) {
      return mondayItems;
    }
    const lowerQuery = query.toLowerCase();
    return mondayItems.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      getAddressFromItem(item).toLowerCase().includes(lowerQuery)
    );
  }

  async function fetchPlanSetFiles(projectId: string) {
    try {
      // Call through edge function to avoid CORS issues
      const { data, error: funcError } = await callEdgeFunction('monday_fetch_plan_sets', {
        board_id: PLAN_SETS_BOARD,
        project_id: projectId,
        plan_set_type: 'initial_submission',
      });

      if (funcError) throw funcError;
      if (data?.error) throw new Error(data.error);

      const files: MondayFile[] = data?.files || [];
      setPlanSetFiles(files);
    } catch (err: any) {
      console.error('Error fetching plan set files:', err);
      setPlanSetFiles([]);
    }
  }

  function handleItemSelect(item: MondayItem) {
    setSelectedItem(item);
    setSearchQuery(item.name);
    setIsDropdownOpen(false);
    setShowMapping(false);
    fetchPlanSetFiles(item.id);
  }

  const filteredItems = filterItems(searchQuery);

  function getAddressFromItem(item: MondayItem): string {
    const addressFields = item.column_values.filter(cv => 
      cv.id?.includes('address') || cv.text?.toLowerCase().includes('address')
    );
    if (addressFields.length > 0) {
      return addressFields[0].text || '';
    }
    return 'No address found';
  }

  async function handleMapProject() {
    if (!selectedItem) return;
    setShowMapping(true);
  }

  async function handleSubmit() {
    if (!selectedItem) {
      setError('Please select a Monday.com project');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResults(null);

      // Create test run
      const newRunId = await createTestRun(scenarioId, null);
      setRunId(newRunId);

      // Call edge function
      const response = await callEdgeFunction('create_test_project', {
        run_id: newRunId,
        monday_item_id: selectedItem.id,
        plan_set_files: planSetFiles,
        mode: 'monday',
      });

      setResults(response);
    } catch (err: any) {
      setError(err.message || 'Failed to execute scenario');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm text-fcc-white/70 mb-2">Select Monday.com Project</label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Search by name or address..."
            className="w-full bg-fcc-black border border-fcc-divider rounded p-2 text-fcc-white focus:border-fcc-cyan focus:outline-none"
          />
          {selectedItem && (
            <button
              type="button"
              onClick={() => {
                setSelectedItem(null);
                setSearchQuery('');
                setPlanSetFiles([]);
              }}
              className="absolute right-2 top-2 text-fcc-white/70 hover:text-fcc-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {isDropdownOpen && filteredItems.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-fcc-black border border-fcc-divider rounded-lg max-h-60 overflow-y-auto">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemSelect(item)}
                className="w-full text-left p-3 hover:bg-fcc-dark transition-colors border-b border-fcc-divider last:border-b-0"
              >
                <div className="text-fcc-white font-semibold">{item.name}</div>
                <div className="text-sm text-fcc-white/70 mt-1">{getAddressFromItem(item)}</div>
              </button>
            ))}
          </div>
        )}

        {searching && !selectedItem && (
          <div className="mt-2">
            <LoadingSpinner className="h-6" />
          </div>
        )}

        {selectedItem && !showMapping && (
          <div className="mt-4 bg-fcc-dark border border-fcc-divider rounded-lg p-4">
            <div className="mb-2">
              <p className="text-sm text-fcc-white/70">Selected Project:</p>
              <p className="text-fcc-white font-semibold">{selectedItem.name}</p>
              <p className="text-sm text-fcc-white/70">{getAddressFromItem(selectedItem)}</p>
            </div>
            {planSetFiles.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-fcc-white/70 mb-1">Plan Set Files ({planSetFiles.length}):</p>
                <div className="space-y-1">
                  {planSetFiles.slice(0, 5).map((file) => (
                    <div key={file.id} className="text-xs text-fcc-white/70 truncate">
                      {file.name}
                    </div>
                  ))}
                  {planSetFiles.length > 5 && (
                    <div className="text-xs text-fcc-white/70">+{planSetFiles.length - 5} more</div>
                  )}
                </div>
              </div>
            )}
            <PrimaryButton
              type="button"
              onClick={handleMapProject}
              className="mt-4"
            >
              Map Project
            </PrimaryButton>
          </div>
        )}
      </div>

      {showMapping && selectedItem && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FCC Required Fields */}
          <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-4">
            <h4 className="text-fcc-white font-semibold mb-4">FCC Required Fields</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-fcc-white/70">Project Name</p>
                <p className="text-fcc-white">-</p>
              </div>
              <div>
                <p className="text-fcc-white/70">Building Department</p>
                <p className="text-fcc-white">-</p>
              </div>
              <div>
                <p className="text-fcc-white/70">Project Type</p>
                <p className="text-fcc-white">-</p>
              </div>
              <div>
                <p className="text-fcc-white/70">Occupancy</p>
                <p className="text-fcc-white">-</p>
              </div>
              <div>
                <p className="text-fcc-white/70">Construction Type</p>
                <p className="text-fcc-white">-</p>
              </div>
              <div>
                <p className="text-fcc-white/70">Address</p>
                <p className="text-fcc-white">-</p>
              </div>
            </div>
          </div>

          {/* Monday.com Values */}
          <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-4">
            <h4 className="text-fcc-white font-semibold mb-4">Monday.com Project Values</h4>
            <div className="space-y-3 text-sm">
              {selectedItem.column_values.map((cv) => (
                <div key={cv.id}>
                  <p className="text-fcc-white/70">{cv.text || cv.id}</p>
                  <p className="text-fcc-white">{cv.value || 'N/A'}</p>
                </div>
              ))}
              {planSetFiles.length > 0 && (
                <div className="mt-4">
                  <p className="text-fcc-white/70 mb-2">Plan Set Files:</p>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {planSetFiles.map((file) => (
                      <div key={file.id} className="text-xs text-fcc-white/70 truncate">
                        {file.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showMapping && (
        <PrimaryButton onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating Project...' : 'Create Project from Monday.com'}
        </PrimaryButton>
      )}

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
    </div>
  );
}

