import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { TestScenario } from '../types';
import Scenario1Form from '../components/scenarios/Scenario1Form';
import Scenario2Form from '../components/scenarios/Scenario2Form';
import Scenario3Form from '../components/scenarios/Scenario3Form';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function ScenarioExecution() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [scenario, setScenario] = useState<TestScenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchScenario(id);
    }
  }, [id]);

  async function fetchScenario(scenarioId: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('test_scenarios')
        .select('*')
        .eq('id', scenarioId)
        .single();

      if (error) throw error;
      setScenario(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch scenario');
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

  if (error || !scenario) {
    return (
      <div className="bg-fcc-dark border border-red-500 rounded-lg p-6">
        <p className="text-red-500">Error: {error || 'Scenario not found'}</p>
        <button
          onClick={() => navigate('/scenarios')}
          className="mt-4 px-4 py-2 bg-fcc-cyan text-fcc-white rounded hover:bg-fcc-cyan/90"
        >
          Back to Scenarios
        </button>
      </div>
    );
  }

  // Determine which form to render based on scenario name or call_function
  const renderScenarioForm = () => {
    const scenarioName = scenario.name.toLowerCase();
    const callFunction = scenario.call_function.toLowerCase();

    if (scenarioName.includes('new application') || callFunction.includes('apply_form_submitted')) {
      return <Scenario1Form scenarioId={scenario.id} />;
    } else if (scenarioName.includes('monday') || callFunction.includes('monday')) {
      return <Scenario3Form scenarioId={scenario.id} />;
    } else {
      return <Scenario2Form scenarioId={scenario.id} />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate('/scenarios')}
          className="text-fcc-white/70 hover:text-fcc-cyan transition-colors mb-4"
        >
          ← Back to Scenarios
        </button>
        <h2 className="text-2xl font-bold text-fcc-white mb-2">{scenario.name}</h2>
        {scenario.description && (
          <p className="text-fcc-white/70">{scenario.description}</p>
        )}
      </div>

      {renderScenarioForm()}
    </div>
  );
}

