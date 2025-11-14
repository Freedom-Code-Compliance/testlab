import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { TestScenario } from '../types';
import SummaryCard from '../components/ui/SummaryCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function ScenarioList() {
  const [scenarios, setScenarios] = useState<TestScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchScenarios();
  }, []);

  async function fetchScenarios() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('test_scenarios')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setScenarios(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch scenarios');
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
        <h2 className="text-2xl font-bold text-fcc-white mb-2">Test Scenarios</h2>
        <p className="text-fcc-white/70">Select a scenario to execute</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario) => (
          <SummaryCard
            key={scenario.id}
            title={scenario.name}
            total={scenario.description || 'No description'}
            onClick={() => navigate(`/scenarios/${scenario.id}`)}
            className="h-full"
          />
        ))}
      </div>

      {scenarios.length === 0 && (
        <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-6 text-center">
          <p className="text-fcc-white/70">No active scenarios found</p>
        </div>
      )}
    </div>
  );
}

