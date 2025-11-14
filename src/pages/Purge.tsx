import { useEffect, useState } from 'react';
import { supabase, callEdgeFunction } from '../lib/supabase';
import { TestRun } from '../types';
import { formatDate, groupBy } from '../lib/utils';
import PrimaryButton from '../components/ui/PrimaryButton';
import StyledInput from '../components/ui/StyledInput';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StatusBadge from '../components/ui/StatusBadge';

export default function Purge() {
  const [runs, setRuns] = useState<TestRun[]>([]);
  const [selectedRuns, setSelectedRuns] = useState<Set<string>>(new Set());
  const [previewData, setPreviewData] = useState<Record<string, Record<string, number>>>({});
  const [purgeReason, setPurgeReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [purging, setPurging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchRuns();
  }, []);

  useEffect(() => {
    if (selectedRuns.size > 0) {
      fetchPreviewData();
    } else {
      setPreviewData({});
    }
  }, [selectedRuns]);

  async function fetchRuns() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('test_runs')
        .select('*')
        .is('purged_at', null)
        .order('run_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setRuns(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch runs');
    } finally {
      setLoading(false);
    }
  }

  async function fetchPreviewData() {
    try {
      const runIds = Array.from(selectedRuns);
      const { data, error } = await supabase
        .from('test_records')
        .select('run_id, table_name')
        .in('run_id', runIds);

      if (error) throw error;

      const grouped = groupBy(data || [], 'run_id');
      const preview: Record<string, Record<string, number>> = {};

      Object.entries(grouped).forEach(([runId, records]) => {
        const tableCounts = groupBy(records, 'table_name');
        preview[runId] = {};
        Object.entries(tableCounts).forEach(([table, tableRecords]) => {
          preview[runId][table] = tableRecords.length;
        });
      });

      setPreviewData(preview);
    } catch (err: any) {
      console.error('Error fetching preview data:', err);
    }
  }

  function toggleRun(runId: string) {
    const newSelected = new Set(selectedRuns);
    if (newSelected.has(runId)) {
      newSelected.delete(runId);
    } else {
      newSelected.add(runId);
    }
    setSelectedRuns(newSelected);
  }

  function toggleAll() {
    if (selectedRuns.size === runs.length) {
      setSelectedRuns(new Set());
    } else {
      setSelectedRuns(new Set(runs.map(r => r.id)));
    }
  }

  async function handlePurge() {
    if (selectedRuns.size === 0) {
      setError('Please select at least one run to purge');
      return;
    }

    if (!purgeReason.trim()) {
      setError('Please provide a purge reason');
      return;
    }

    try {
      setPurging(true);
      setError(null);
      setSuccess(null);

      const runIds = Array.from(selectedRuns);
      
      for (const runId of runIds) {
        await callEdgeFunction('testlab_purge_by_run', {
          run_id: runId,
          purge_reason: purgeReason,
        });
      }

      setSuccess(`Successfully purged ${runIds.length} run(s)`);
      setSelectedRuns(new Set());
      setPurgeReason('');
      await fetchRuns();
    } catch (err: any) {
      setError(err.message || 'Failed to purge runs');
    } finally {
      setPurging(false);
    }
  }

  // Calculate totals
  const totalCounts: Record<string, number> = {};
  Object.values(previewData).forEach((runCounts) => {
    Object.entries(runCounts).forEach(([table, count]) => {
      totalCounts[table] = (totalCounts[table] || 0) + count;
    });
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-fcc-white mb-2">Purge Test Runs</h2>
        <p className="text-fcc-white/70">Select runs to purge and provide a reason</p>
      </div>

      <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-fcc-white">Select Runs</h3>
          <button
            onClick={toggleAll}
            className="text-sm text-fcc-cyan hover:text-fcc-blue transition-colors"
          >
            {selectedRuns.size === runs.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {runs.map((run) => (
            <label
              key={run.id}
              className="flex items-center space-x-3 p-3 bg-fcc-black rounded hover:bg-fcc-divider cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedRuns.has(run.id)}
                onChange={() => toggleRun(run.id)}
                className="w-4 h-4 text-fcc-cyan focus:ring-fcc-cyan rounded"
              />
              <div className="flex-1">
                <p className="text-sm text-fcc-white font-mono">{run.id.substring(0, 8)}...</p>
                <p className="text-xs text-fcc-white/70">{formatDate(run.run_at)}</p>
              </div>
            </label>
          ))}
        </div>

        {runs.length === 0 && (
          <p className="text-fcc-white/70 text-center py-8">No unpurged runs found</p>
        )}
      </div>

      {selectedRuns.size > 0 && (
        <>
          <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-6">
            <h3 className="text-lg font-semibold text-fcc-white mb-4">Preview</h3>
            <p className="text-sm text-fcc-white/70 mb-4">
              The following records will be purged:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(totalCounts).map(([table, count]) => (
                <div key={table} className="bg-fcc-black rounded p-3">
                  <p className="text-xs text-fcc-white/70 uppercase mb-1">{table}</p>
                  <p className="text-2xl font-bold text-fcc-cyan">{count}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-fcc-divider">
              <p className="text-sm text-fcc-white/70 mb-2">Total records to purge:</p>
              <p className="text-3xl font-bold text-fcc-cyan">
                {Object.values(totalCounts).reduce((sum, count) => sum + count, 0)}
              </p>
            </div>
          </div>

          <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-6">
            <StyledInput
              label="Purge Reason *"
              value={purgeReason}
              onChange={(e) => setPurgeReason(e.target.value)}
              placeholder="Enter reason for purging these runs..."
              required
            />

            <PrimaryButton
              onClick={handlePurge}
              disabled={purging || !purgeReason.trim()}
              className="mt-4"
            >
              {purging ? 'Purging...' : `Purge ${selectedRuns.size} Run(s)`}
            </PrimaryButton>
          </div>
        </>
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

      {success && (
        <div className="bg-fcc-dark border border-green-500 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-2">
            <StatusBadge status="success" />
            <span className="text-green-500 font-semibold">Success</span>
          </div>
          <p className="text-green-400">{success}</p>
        </div>
      )}
    </div>
  );
}

