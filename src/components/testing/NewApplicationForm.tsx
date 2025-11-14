import { useState } from 'react';
import { createTestRun, callEdgeFunction } from '../../lib/supabase';
import PrimaryButton from '../ui/PrimaryButton';
import LoadingSpinner from '../ui/LoadingSpinner';
import StatusBadge from '../ui/StatusBadge';

interface NewApplicationFormProps {
  scenarioId: string;
}

export default function NewApplicationForm({ scenarioId }: NewApplicationFormProps) {
  const [loading, setLoading] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    try {
      setLoading(true);
      setError(null);
      setResults(null);

      // Create test run
      const newRunId = await createTestRun(scenarioId, null);
      setRunId(newRunId);

      // Call edge function with proper authentication
      const { data, error: funcError } = await callEdgeFunction('apply_form_submitted', {
        run_id: newRunId,
      });

      if (funcError) throw funcError;
      setResults(data);
    } catch (err: any) {
      console.error('Error executing scenario:', err);
      setError(err.message || 'Failed to execute scenario');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-fcc-white/70 mb-4">
          This scenario creates a new company, contact, and deal using the apply_form_submitted edge function.
        </p>
        <PrimaryButton onClick={handleSubmit} disabled={loading}>
          {loading ? 'Running...' : 'Run Scenario'}
        </PrimaryButton>
      </div>

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

          {results.counts && (
            <div>
              <p className="text-sm text-fcc-white/70 mb-2">Records Created:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(results.counts).map(([table, count]: [string, any]) => (
                  <div key={table} className="bg-fcc-black rounded p-3">
                    <p className="text-xs text-fcc-white/70 uppercase">{table}</p>
                    <p className="text-2xl font-bold text-fcc-cyan">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

