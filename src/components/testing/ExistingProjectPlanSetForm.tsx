import { useState, useEffect } from 'react';
import { supabase, createTestRun } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import SearchableSelect from '../ui/SearchableSelect';
import PrimaryButton from '../ui/PrimaryButton';
import LoadingSpinner from '../ui/LoadingSpinner';
import PlanSetPanel from './PlanSetPanel';

interface ExistingProjectPlanSetFormProps {
  scenarioId: string;
}

interface Project {
  id: string;
  name: string;
  address_line1: string | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
}

export default function ExistingProjectPlanSetForm({ scenarioId }: ExistingProjectPlanSetFormProps) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [runId, setRunId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingProjects, setFetchingProjects] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startingPlanSet, setStartingPlanSet] = useState(false);

  // Fetch eligible projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setFetchingProjects(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('v_projects_without_initial_plan_set')
          .select('id, name, address_line1, city, state, zipcode')
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        setProjects(data || []);
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        setError(err.message || 'Failed to fetch eligible projects');
      } finally {
        setFetchingProjects(false);
      }
    };

    void fetchProjects();
  }, []);

  const handleStartPlanSet = async () => {
    if (!selectedProjectId || !user?.id) {
      setError('Please select a project and ensure you are logged in');
      return;
    }

    try {
      setStartingPlanSet(true);
      setError(null);

      // Create test run
      const runData = await createTestRun(scenarioId, user.id);
      const newRunId = runData?.run_id || runData;

      if (!newRunId) {
        throw new Error('Failed to create test run: no run_id returned');
      }

      setRunId(newRunId);
    } catch (err: any) {
      console.error('Error starting plan set:', err);
      setError(err.message || 'Failed to start plan set');
      setStartingPlanSet(false);
    }
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  
  // Format project display: "Project Name — City, ST ZIP"
  const formatProjectLabel = (project: Project): string => {
    const parts: string[] = [project.name || 'Unnamed Project'];
    
    if (project.city || project.state || project.zipcode) {
      const locationParts: string[] = [];
      if (project.city) locationParts.push(project.city);
      if (project.state) locationParts.push(project.state);
      if (project.zipcode) locationParts.push(project.zipcode);
      if (locationParts.length > 0) {
        parts.push(locationParts.join(', '));
      }
    }
    
    return parts.join(' — ');
  };

  const projectOptions = projects.map(project => ({
    value: project.id,
    label: formatProjectLabel(project),
  }));

  return (
    <div className="space-y-6">
      {/* Project Selector */}
      <div className="space-y-4">
        <SearchableSelect
          label="Select Project"
          value={selectedProjectId}
          onChange={setSelectedProjectId}
          options={projectOptions}
          placeholder={fetchingProjects ? 'Loading projects...' : 'Select a project...'}
          error={error && !runId ? error : undefined}
          required
        />

        {fetchingProjects && (
          <div className="flex items-center gap-2 text-fcc-white/70">
            <LoadingSpinner />
            <span className="text-sm">Loading eligible projects...</span>
          </div>
        )}

        {!fetchingProjects && projects.length === 0 && (
          <div className="bg-fcc-dark border border-fcc-divider rounded-lg p-4">
            <p className="text-fcc-white/70 text-sm">
              No projects are currently eligible. A project is eligible when it has no Initial plan set.
            </p>
          </div>
        )}

        {selectedProjectId && !runId && (
          <PrimaryButton
            type="button"
            onClick={handleStartPlanSet}
            disabled={startingPlanSet || !selectedProjectId}
            className="w-full"
          >
            {startingPlanSet ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Starting Plan Set...</span>
              </>
            ) : (
              'Start Plan Set'
            )}
          </PrimaryButton>
        )}

        {error && !runId && (
          <div className="bg-fcc-dark border border-red-500 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Plan Set Panel - Show when runId and project are selected */}
      {runId && selectedProjectId && (
        <PlanSetPanel
          projectId={selectedProjectId}
          runId={runId}
          scenarioId={scenarioId}
          onPlanSetSubmitted={() => {
            // Optional: Could show success message or refresh project list
            // The project should disappear from dropdown after it gets an Initial plan set
          }}
        />
      )}
    </div>
  );
}

