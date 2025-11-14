import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { TestRun, TestRecord, TestScenario } from '../types';
import { formatDate, groupBy } from '../lib/utils';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function RunDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [run, setRun] = useState<TestRun | null>(null);
  const [scenario, setScenario] = useState<TestScenario | null>(null);
  const [records, setRecords] = useState<TestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchRunDetails(id);
    }
  }, [id]);

  async function fetchRunDetails(runId: string) {
    try {
      setLoading(true);

      // Fetch run
      const { data: runData, error: runError } = await supabase
        .from('test_runs')
        .select('*')
        .eq('id', runId)
        .single();

      if (runError) throw runError;
      setRun(runData);

      // Fetch scenario
      if (runData.scenario_id) {
        const { data: scenarioData } = await supabase
          .from('test_scenarios')
          .select('*')
          .eq('id', runData.scenario_id)
          .single();
        setScenario(scenarioData);
      }

      // Fetch test records
      const { data: recordsData, error: recordsError } = await supabase
        .from('test_records')
        .select('*')
        .eq('run_id', runId)
        .order('table_name');

      if (recordsError) throw recordsError;
      setRecords(recordsData || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch run details');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !run) {
    return (
      <div className="bg-fcc-dark border border-red-500 rounded-lg p-6">
        <p className="text-red-500">Error: {error || 'Run not found'}</p>
        <button
          onClick={() => navigate('/runs')}
          className="mt-4 px-4 py-2 bg-fcc-cyan text-fcc-white rounded hover:bg-fcc-cyan/90"
        >
          Back to Runs
        </button>
      </div>
    );
  }

  const groupedRecords = groupBy(records, 'table_name');

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate('/runs')}
          className="text-fcc-white/70 hover:text-fcc-cyan transition-colors mb-4"
        >
          ← Back to Runs
        </button>
        <h2 className="text-2xl font-bold text-fcc-white mb-2">Run Details</h2>
      </div>

      <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-fcc-white/70 mb-1">Run ID:</p>
            <p className="text-fcc-white font-mono text-sm">{run.id}</p>
          </div>
          <div>
            <p className="text-sm text-fcc-white/70 mb-1">Scenario:</p>
            <p className="text-fcc-white">{scenario?.name || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-sm text-fcc-white/70 mb-1">Run At:</p>
            <p className="text-fcc-white">{formatDate(run.run_at)}</p>
          </div>
          {run.purged_at && (
            <div>
              <p className="text-sm text-fcc-white/70 mb-1">Purged At:</p>
              <p className="text-fcc-white">{formatDate(run.purged_at)}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-6">
        <h3 className="text-lg font-semibold text-fcc-white mb-4">
          Test Records ({records.length} total)
        </h3>

        <div className="space-y-4">
          {Object.entries(groupedRecords).map(([tableName, tableRecords]) => (
            <div key={tableName} className="bg-fcc-black rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-fcc-white font-semibold">{tableName}</h4>
                <span className="text-fcc-cyan font-bold">{tableRecords.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {tableRecords.map((record) => (
                  <div
                    key={record.id}
                    className="bg-fcc-dark rounded p-2 text-xs text-fcc-white/70 font-mono truncate"
                    title={record.record_id}
                  >
                    {record.record_id}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {records.length === 0 && (
          <p className="text-fcc-white/70 text-center py-8">No test records found for this run</p>
        )}
      </div>
    </div>
  );
}

