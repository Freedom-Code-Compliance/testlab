import { useEffect, useState } from 'react';
import { supabase, callEdgeFunction, getCurrentUser } from '../lib/supabase';
import { TestRun } from '../types';
import { formatDate, groupBy } from '../lib/utils';
import PrimaryButton from '../components/ui/PrimaryButton';
import StyledInput from '../components/ui/StyledInput';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StatusBadge from '../components/ui/StatusBadge';

// Extended run type with entity name info
interface RunWithEntity extends TestRun {
  entityName?: string;
  entityType?: 'project' | 'deal' | 'company' | null;
  entityDeleted?: boolean; // True if the entity was already deleted from database
}

export default function Purge() {
  const [runs, setRuns] = useState<RunWithEntity[]>([]);
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
      
      // Fetch test runs
      const { data: runsData, error: runsError } = await supabase
        .from('test_runs')
        .select('*')
        .is('purged_at', null)
        .order('run_at', { ascending: false })
        .limit(100);

      if (runsError) throw runsError;
      
      if (!runsData || runsData.length === 0) {
        setRuns([]);
        return;
      }

      // Fetch test_records for projects, deals, and companies to get entity names
      const runIds = runsData.map(r => r.id);
      const { data: recordsData } = await supabase
        .from('test_records')
        .select('run_id, table_name, record_id')
        .in('run_id', runIds)
        .in('table_name', ['projects', 'deals', 'companies']);

      // Build a map of run_id -> record info
      const runRecordMap: Record<string, { table_name: string; record_id: string }[]> = {};
      (recordsData || []).forEach(rec => {
        if (!runRecordMap[rec.run_id]) {
          runRecordMap[rec.run_id] = [];
        }
        runRecordMap[rec.run_id].push({ table_name: rec.table_name, record_id: rec.record_id });
      });

      // Get unique project, deal, and company IDs
      const projectIds = (recordsData || [])
        .filter(r => r.table_name === 'projects')
        .map(r => r.record_id);
      const dealIds = (recordsData || [])
        .filter(r => r.table_name === 'deals')
        .map(r => r.record_id);
      const companyIds = (recordsData || [])
        .filter(r => r.table_name === 'companies')
        .map(r => r.record_id);

      // Fetch project names
      let projectNameMap: Record<string, string> = {};
      if (projectIds.length > 0) {
        const { data: projectsData } = await supabase
          .from('projects')
          .select('id, name')
          .in('id', projectIds);
        (projectsData || []).forEach(p => {
          projectNameMap[p.id] = p.name || 'Unnamed Project';
        });
      }

      // Fetch deal titles
      let dealNameMap: Record<string, string> = {};
      if (dealIds.length > 0) {
        const { data: dealsData } = await supabase
          .from('deals')
          .select('id, title')
          .in('id', dealIds);
        (dealsData || []).forEach(d => {
          dealNameMap[d.id] = d.title || 'Unnamed Deal';
        });
      }

      // Fetch company names
      let companyNameMap: Record<string, string> = {};
      if (companyIds.length > 0) {
        const { data: companiesData } = await supabase
          .from('companies')
          .select('id, name')
          .in('id', companyIds);
        (companiesData || []).forEach(c => {
          companyNameMap[c.id] = c.name || 'Unnamed Company';
        });
      }

      // Merge entity names into runs
      // Priority: project > deal > company
      // Important: Try to find an EXISTING entity first before falling back to deleted ones
      const runsWithEntities: RunWithEntity[] = runsData.map(run => {
        const records = runRecordMap[run.id] || [];
        
        // Get all records of each type for this run
        const projectRecords = records.filter(r => r.table_name === 'projects');
        const dealRecords = records.filter(r => r.table_name === 'deals');
        const companyRecords = records.filter(r => r.table_name === 'companies');
        
        let entityName: string | undefined;
        let entityType: 'project' | 'deal' | 'company' | null = null;
        let entityDeleted = false;
        
        // Try to find an existing project first
        const existingProject = projectRecords.find(r => projectNameMap[r.record_id]);
        const deletedProject = projectRecords.find(r => !projectNameMap[r.record_id]);
        
        // Try to find an existing deal first
        const existingDeal = dealRecords.find(r => dealNameMap[r.record_id]);
        const deletedDeal = dealRecords.find(r => !dealNameMap[r.record_id]);
        
        // Try to find an existing company first
        const existingCompany = companyRecords.find(r => companyNameMap[r.record_id]);
        const deletedCompany = companyRecords.find(r => !companyNameMap[r.record_id]);
        
        // Priority: existing project > existing deal > existing company > deleted project > deleted deal > deleted company
        if (existingProject) {
          entityName = projectNameMap[existingProject.record_id];
          entityType = 'project';
        } else if (existingDeal) {
          entityName = dealNameMap[existingDeal.record_id];
          entityType = 'deal';
        } else if (existingCompany) {
          entityName = companyNameMap[existingCompany.record_id];
          entityType = 'company';
        } else if (deletedProject) {
          entityName = `Project (ID: ${deletedProject.record_id.slice(0, 8)}...)`;
          entityType = 'project';
          entityDeleted = true;
        } else if (deletedDeal) {
          entityName = `Deal (ID: ${deletedDeal.record_id.slice(0, 8)}...)`;
          entityType = 'deal';
          entityDeleted = true;
        } else if (deletedCompany) {
          entityName = `Company (ID: ${deletedCompany.record_id.slice(0, 8)}...)`;
          entityType = 'company';
          entityDeleted = true;
        }
        
        return {
          ...run,
          entityName,
          entityType,
          entityDeleted,
        };
      });

      setRuns(runsWithEntities);
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

      // Get current user for actorId
      const user = await getCurrentUser();
      if (!user || !user.id) {
        setError('You must be logged in to purge runs');
        return;
      }

      const runIds = Array.from(selectedRuns);
      
      // Batch all runs into a single call
      await callEdgeFunction('testlab_purge_by_run', {
        runIds: runIds,
        reason: purgeReason,
        actorId: user.id,
      });

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

        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {runs.map((run) => (
            <label
              key={run.id}
              className="flex items-start space-x-3 p-4 bg-fcc-black rounded hover:bg-fcc-divider cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedRuns.has(run.id)}
                onChange={() => toggleRun(run.id)}
                className="w-4 h-4 mt-1 text-fcc-cyan focus:ring-fcc-cyan rounded flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                {/* Entity Name (Project, Deal, or Company) - prominent display */}
                {run.entityName ? (
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-sm font-semibold truncate ${
                      run.entityDeleted ? 'text-fcc-white/60 italic' : 'text-fcc-white'
                    }`}>
                      {run.entityName}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      run.entityType === 'project' 
                        ? 'bg-blue-900/50 text-blue-300' 
                        : run.entityType === 'deal'
                        ? 'bg-purple-900/50 text-purple-300'
                        : 'bg-green-900/50 text-green-300'
                    }`}>
                      {run.entityType}
                    </span>
                    {run.entityDeleted && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-red-900/50 text-red-300">
                        deleted
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-fcc-white/50 italic mb-1">No primary entity (possibly a failed or incomplete run)</p>
                )}
                
                {/* Full Run ID */}
                <p className="text-xs text-fcc-white/70 font-mono break-all mb-1">
                  Run ID: {run.id}
                </p>
                
                {/* Date */}
                <p className="text-xs text-fcc-white/50">{formatDate(run.run_at)}</p>
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

