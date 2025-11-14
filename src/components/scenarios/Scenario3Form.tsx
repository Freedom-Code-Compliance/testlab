import { useState } from 'react';
import { createTestRun, callEdgeFunction } from '../../lib/supabase';
import StyledInput from '../ui/StyledInput';
import StyledSelect from '../ui/StyledSelect';
import PrimaryButton from '../ui/PrimaryButton';
import LoadingSpinner from '../ui/LoadingSpinner';
import StatusBadge from '../ui/StatusBadge';

interface Scenario3FormProps {
  scenarioId: string;
}

const MONDAY_API_KEY = import.meta.env.VITE_MONDAY_API_KEY || '';

const PLAN_SET_TYPE_MAPPING = [
  { value: 'construction_plans', label: 'Construction Plans' },
  { value: 'truss_documents', label: 'Truss Documents' },
  { value: 'noa_product_approvals', label: 'NOA Product Approvals' },
  { value: 'energy_load_calcs', label: 'Energy Load Calcs' },
  { value: 'zoning_documents', label: 'Zoning Documents' },
  { value: 'other_documents', label: 'Other Documents' },
];

interface MondayItem {
  id: string;
  name: string;
  column_values: Array<{ id: string; text: string; value: string }>;
}

export default function Scenario3Form({ scenarioId }: Scenario3FormProps) {
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [mondayItemId, setMondayItemId] = useState('');
  const [mondayItem, setMondayItem] = useState<MondayItem | null>(null);
  const [fileTypeMappings, setFileTypeMappings] = useState<Record<string, string>>({});


  async function fetchMondayItem(itemId: string) {
    try {
      setSearching(true);
      const response = await fetch('https://api.monday.com/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': MONDAY_API_KEY,
        },
        body: JSON.stringify({
          query: `
            query {
              items(ids: [${itemId}]) {
                id
                name
                column_values {
                  id
                  text
                  value
                }
              }
            }
          `,
        }),
      });

      const data = await response.json();
      if (data.errors) throw new Error(data.errors[0].message);

      const item = data.data.items[0];
      if (item) {
        setMondayItem(item);
        setMondayItemId(itemId);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Monday.com item');
    } finally {
      setSearching(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mondayItemId) {
      setError('Please select a Monday.com item');
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
        monday_item_id: mondayItemId,
        file_type_mappings: fileTypeMappings,
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-fcc-white mb-4">
          Create New Project (From Monday.com)
        </h3>

        <div>
          <StyledInput
            label="Monday.com Item ID"
            value={mondayItemId}
            onChange={(e) => setMondayItemId(e.target.value)}
            placeholder="Enter Monday.com item ID or search..."
          />
          <PrimaryButton
            type="button"
            onClick={() => fetchMondayItem(mondayItemId)}
            disabled={!mondayItemId || searching}
            className="mt-2"
          >
            {searching ? 'Loading...' : 'Load Item'}
          </PrimaryButton>
        </div>

        {mondayItem && (
          <div className="bg-fcc-black rounded-lg p-4 space-y-4">
            <div>
              <p className="text-sm text-fcc-white/70 mb-1">Item Name:</p>
              <p className="text-fcc-white font-semibold">{mondayItem.name}</p>
            </div>

            <div>
              <p className="text-sm text-fcc-white/70 mb-2">Field Mappings:</p>
              <div className="space-y-2">
                {mondayItem.column_values.map((col) => (
                  <div key={col.id} className="flex items-center space-x-2">
                    <span className="text-sm text-fcc-white/70 w-32 truncate">{col.text}:</span>
                    <span className="text-sm text-fcc-white flex-1">{col.value || 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-fcc-white/70 mb-2">Plan Set Type Mappings:</p>
              <div className="space-y-2">
                {PLAN_SET_TYPE_MAPPING.map((type) => (
                  <StyledSelect
                    key={type.value}
                    label={type.label}
                    value={fileTypeMappings[type.value] || ''}
                    onChange={(e) => setFileTypeMappings(prev => ({
                      ...prev,
                      [type.value]: e.target.value
                    }))}
                    options={[
                      { value: '', label: 'Not mapped' },
                      ...mondayItem.column_values
                        .filter(col => col.text.toLowerCase().includes('file') || col.text.toLowerCase().includes('plan'))
                        .map(col => ({ value: col.id, label: col.text }))
                    ]}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <PrimaryButton type="submit" disabled={loading || !mondayItem}>
          {loading ? 'Creating Project...' : 'Create Project from Monday.com'}
        </PrimaryButton>
      </div>

      {loading && (
        <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <LoadingSpinner />
            <span className="text-fcc-white">Creating project from Monday.com...</span>
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

