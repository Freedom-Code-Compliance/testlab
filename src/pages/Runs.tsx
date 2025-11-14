import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { TestRun, TestScenario } from '../types';
import { formatRelativeTime } from '../lib/utils';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StatusBadge from '../components/ui/StatusBadge';

export default function Runs() {
  const [runs, setRuns] = useState<(TestRun & { scenario?: TestScenario })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRuns();
  }, []);

  async function fetchRuns() {
    try {
      setLoading(true);
      const { data: runsData, error: runsError } = await supabase
        .from('test_runs')
        .select('*')
        .order('run_at', { ascending: false })
        .limit(100);

      if (runsError) throw runsError;

      // Fetch scenarios
      const scenarioIds = [...new Set(runsData?.map(r => r.scenario_id) || [])];
      const { data: scenariosData } = await supabase
        .from('test_scenarios')
        .select('*')
        .in('id', scenarioIds);

      const scenariosMap = new Map(scenariosData?.map(s => [s.id, s]) || []);

      // Fetch activity logs to determine status
      const runIds = runsData?.map(r => r.id) || [];
      const { data: activityData } = await supabase
        .from('activity_log')
        .select('*')
        .in('target_id', runIds)
        .in('action', ['test_run_created', 'test_run_failed', 'test_run_completed']);

      const statusMap = new Map<string, string>();
      activityData?.forEach(log => {
        if (log.target_id) {
          const existing = statusMap.get(log.target_id);
          // Prioritize failed status, then completed, then created
          if (!existing || log.action === 'test_run_failed' || 
              (existing === 'test_run_created' && log.action === 'test_run_completed')) {
            statusMap.set(log.target_id, log.action);
          }
        }
      });

      const runsWithScenarios = runsData?.map(run => ({
        ...run,
        scenario: scenariosMap.get(run.scenario_id),
        status: statusMap.get(run.id) || 'unknown',
      })) || [];

      setRuns(runsWithScenarios);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch runs');
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadge(status: string) {
    if (status === 'test_run_completed') return <StatusBadge status="completed" />;
    if (status === 'test_run_failed') return <StatusBadge status="failed" />;
    if (status === 'test_run_created') return <StatusBadge status="pending" />;
    return <StatusBadge status="pending" />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-fcc-dark border border-red-500 rounded-lg p-6">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-fcc-white mb-2">Test Runs</h2>
        <p className="text-fcc-white/70">View all test run executions</p>
      </div>

      <div className="bg-fcc-dark border border-fcc-divider rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-fcc-black border-b border-fcc-divider">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-fcc-white">Run ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-fcc-white">Scenario</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-fcc-white">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-fcc-white">Run At</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-fcc-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr
                key={run.id}
                className="border-b border-fcc-divider hover:bg-fcc-black/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/runs/${run.id}`)}
              >
                <td className="px-4 py-3 text-sm text-fcc-white font-mono">
                  {run.id.substring(0, 8)}...
                </td>
                <td className="px-4 py-3 text-sm text-fcc-white">
                  {run.scenario?.name || 'Unknown Scenario'}
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge((run as any).status)}
                </td>
                <td className="px-4 py-3 text-sm text-fcc-white/70">
                  {formatRelativeTime(run.run_at)}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/runs/${run.id}`);
                    }}
                    className="text-fcc-cyan hover:text-fcc-blue transition-colors text-sm"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {runs.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-fcc-white/70">No test runs found</p>
          </div>
        )}
      </div>
    </div>
  );
}

