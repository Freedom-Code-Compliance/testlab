import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { TestRun, TestScenario, ActivityLog } from '../types';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import SummaryCard from '../components/ui/SummaryCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StyledSelect from '../components/ui/StyledSelect';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [runs, setRuns] = useState<TestRun[]>([]);
  const [scenarios, setScenarios] = useState<TestScenario[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [dateRange, setDateRange] = useState('7'); // days
  const [scenarioFilter, setScenarioFilter] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, [dateRange, scenarioFilter]);

  async function fetchData() {
    try {
      setLoading(true);
      const startDate = startOfDay(subDays(new Date(), parseInt(dateRange)));
      const endDate = endOfDay(new Date());

      // Fetch runs
      let runsQuery = supabase
        .from('test_runs')
        .select('*')
        .gte('run_at', startDate.toISOString())
        .lte('run_at', endDate.toISOString())
        .order('run_at', { ascending: false });

      if (scenarioFilter !== 'all') {
        runsQuery = runsQuery.eq('scenario_id', scenarioFilter);
      }

      const { data: runsData } = await runsQuery;

      // Fetch scenarios
      const { data: scenariosData } = await supabase
        .from('test_scenarios')
        .select('*')
        .eq('active', true);

      // Fetch activity logs for status
      const runIds = runsData?.map(r => r.id) || [];
      const { data: activityData } = await supabase
        .from('activity_log')
        .select('*')
        .in('target_id', runIds.length > 0 ? runIds : ['00000000-0000-0000-0000-000000000000'])
        .in('action', ['test_run_created', 'test_run_failed', 'test_run_completed']);

      setRuns(runsData || []);
      setScenarios(scenariosData || []);
      setActivityLogs(activityData || []);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  // Calculate metrics
  const statusMap = new Map<string, string>();
  activityLogs.forEach(log => {
    if (log.target_id) {
      const existing = statusMap.get(log.target_id);
      if (!existing || log.action === 'test_run_failed' ||
          (existing === 'test_run_created' && log.action === 'test_run_completed')) {
        statusMap.set(log.target_id, log.action);
      }
    }
  });

  const totalRuns = runs.length;
  const completedRuns = runs.filter(r => statusMap.get(r.id) === 'test_run_completed').length;
  const failedRuns = runs.filter(r => statusMap.get(r.id) === 'test_run_failed').length;
  const successRate = totalRuns > 0 ? ((completedRuns / totalRuns) * 100).toFixed(1) : '0';

  // Runs by scenario
  const runsByScenario = scenarios.map(scenario => {
    const scenarioRuns = runs.filter(r => r.scenario_id === scenario.id);
    return {
      name: scenario.name,
      runs: scenarioRuns.length,
      completed: scenarioRuns.filter(r => statusMap.get(r.id) === 'test_run_completed').length,
      failed: scenarioRuns.filter(r => statusMap.get(r.id) === 'test_run_failed').length,
    };
  }).filter(s => s.runs > 0);

  // Runs over time (daily)
  const runsByDay = runs.reduce((acc, run) => {
    const day = format(new Date(run.run_at), 'MMM d');
    if (!acc[day]) {
      acc[day] = { date: day, runs: 0, completed: 0, failed: 0 };
    }
    acc[day].runs++;
    const status = statusMap.get(run.id);
    if (status === 'test_run_completed') acc[day].completed++;
    if (status === 'test_run_failed') acc[day].failed++;
    return acc;
  }, {} as Record<string, any>);

  const runsOverTime = Object.values(runsByDay).sort((a: any, b: any) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Success vs Failure pie chart
  const successFailureData = [
    { name: 'Success', value: completedRuns },
    { name: 'Failed', value: failedRuns },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-fcc-white mb-2">Dashboard</h2>
          <p className="text-fcc-white/70">Test run analytics and metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <StyledSelect
            label="Date Range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={[
              { value: '7', label: 'Last 7 days' },
              { value: '30', label: 'Last 30 days' },
              { value: '90', label: 'Last 90 days' },
              { value: '365', label: 'Last year' },
            ]}
          />
          <StyledSelect
            label="Scenario"
            value={scenarioFilter}
            onChange={(e) => setScenarioFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Scenarios' },
              ...scenarios.map(s => ({ value: s.id, label: s.name }))
            ]}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Runs"
          total={totalRuns}
        />
        <SummaryCard
          title="Success Rate"
          total={`${successRate}%`}
        />
        <SummaryCard
          title="Completed"
          total={completedRuns}
        />
        <SummaryCard
          title="Failed"
          total={failedRuns}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Runs Over Time */}
        <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-6">
          <h3 className="text-lg font-semibold text-fcc-white mb-4">Runs Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={runsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="date" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', color: '#ffffff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="runs" stroke="#3366FF" name="Total Runs" />
              <Line type="monotone" dataKey="completed" stroke="#4CAF50" name="Completed" />
              <Line type="monotone" dataKey="failed" stroke="#F44336" name="Failed" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Success vs Failure */}
        <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-6">
          <h3 className="text-lg font-semibold text-fcc-white mb-4">Success vs Failure</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={successFailureData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {successFailureData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#4CAF50' : '#F44336'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', color: '#ffffff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Runs by Scenario */}
        <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-fcc-white mb-4">Runs by Scenario</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={runsByScenario}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="name" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', color: '#ffffff' }}
              />
              <Legend />
              <Bar dataKey="runs" fill="#3366FF" name="Total Runs" />
              <Bar dataKey="completed" fill="#4CAF50" name="Completed" />
              <Bar dataKey="failed" fill="#F44336" name="Failed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

