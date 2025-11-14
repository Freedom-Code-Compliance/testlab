import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TestScenario } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import NewApplicationForm from '../components/testing/NewApplicationForm';
import ManualProjectForm from '../components/testing/ManualProjectForm';
import MondayProjectForm from '../components/testing/MondayProjectForm';

export default function Testing() {
  const [scenarios, setScenarios] = useState<TestScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  function handleScenarioSelect(scenarioId: string) {
    setSelectedScenario(selectedScenario === scenarioId ? null : scenarioId);
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
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-fcc-white mb-2">Testing Scenarios</h2>
        <p className="text-fcc-white/70">Select a scenario to execute</p>
      </div>

      <div className="space-y-2">
        {scenarios.map((scenario) => {
          const isSelected = selectedScenario === scenario.id;
          const scenarioName = scenario.name.toLowerCase();
          
          // Determine scenario type
          let scenarioType: 'new-application' | 'manual' | 'monday' = 'manual';
          if (scenarioName.includes('new application') || scenarioName.includes('apply form')) {
            scenarioType = 'new-application';
          } else if (scenarioName.includes('monday')) {
            scenarioType = 'monday';
          }

          return (
            <div key={scenario.id} className="space-y-2">
              <button
                onClick={() => handleScenarioSelect(scenario.id)}
                className={`w-full bg-fcc-dark border border-fcc-divider rounded-lg p-4 text-left hover:border-fcc-cyan transition-colors ${
                  isSelected ? 'border-fcc-cyan' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-fcc-white">{scenario.name}</h3>
                    {scenario.description && (
                      <p className="text-sm text-fcc-white/70 mt-1">{scenario.description}</p>
                    )}
                  </div>
                  <div className={`transform transition-transform ${isSelected ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-fcc-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>

              {isSelected && (
                <div className="bg-fcc-black border border-fcc-divider rounded-lg p-6 animate-slide-up">
                  {scenarioType === 'new-application' && (
                    <NewApplicationForm scenarioId={scenario.id} />
                  )}
                  {scenarioType === 'manual' && (
                    <ManualProjectForm scenarioId={scenario.id} />
                  )}
                  {scenarioType === 'monday' && (
                    <MondayProjectForm scenarioId={scenario.id} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {scenarios.length === 0 && (
        <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-6 text-center">
          <p className="text-fcc-white/70">No active scenarios found</p>
        </div>
      )}
    </div>
  );
}

