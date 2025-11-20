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
  const [planSetId, setPlanSetId] = useState<string | null>(null);
  const [planSetSubmitted, setPlanSetSubmitted] = useState(false);
  const [uploadedFilesSummary, setUploadedFilesSummary] = useState<
    { id: string; name: string; fileTypeName: string }[]
  >([]);
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

      // Check if an INITIAL plan set already exists for this project
      const { data: existing, error: existingError } = await supabase
        .from('plan_sets')
        .select('id')
        .eq('project_id', selectedProjectId)
        .eq('type', 'INITIAL')
        .is('deleted_at', null)
        .maybeSingle();

      if (existingError) {
        console.error('[ExistingProjectPlanSetForm] Error checking existing plan set:', existingError);
        setError('Failed to check existing plan set.');
        setStartingPlanSet(false);
        return;
      }

      let newPlanSetId = existing?.id;

      // If none exists, create one
      if (!newPlanSetId) {
        // Lookup draft document review status
        const { data: draftStatusData, error: draftStatusError } = await supabase
          .from('plan_sets_document_review_field')
          .select('id')
          .eq('code', 'draft')
          .is('deleted_at', null)
          .single();

        if (draftStatusError || !draftStatusData?.id) {
          console.error('[ExistingProjectPlanSetForm] Status lookup error', draftStatusError);
          setError('Failed to resolve document status for plan set creation.');
          setStartingPlanSet(false);
          return;
        }

        const { data: inserted, error: insertError } = await supabase
          .from('plan_sets')
          .insert({
            project_id: selectedProjectId,
            type: 'INITIAL',
            document_review_status_id: draftStatusData.id,
            created_by: user.id,
          })
          .select('id')
          .single();

        if (insertError || !inserted) {
          console.error('[ExistingProjectPlanSetForm] Error creating initial plan set:', insertError);
          setError('Failed to create initial plan set.');
          setStartingPlanSet(false);
          return;
        }

        newPlanSetId = inserted.id;

        // TestLab logging
        try {
          const { error: logError } = await supabase.rpc('testlab_log_record', {
            p_run_id: newRunId,
            p_scenario_id: scenarioId,
            p_table_name: 'plan_sets',
            p_record_id: inserted.id,
            p_created_by: user.id,
            p_table_id: null,
          });
          if (logError) {
            console.error('Failed to log plan_sets test record:', logError);
          }
        } catch (logErr) {
          console.error('Error logging plan_sets test record:', logErr);
        }
      }

      setPlanSetId(newPlanSetId!);
    } catch (err: any) {
      console.error('Error starting plan set:', err);
      setError(err.message || 'Failed to start plan set');
      setStartingPlanSet(false);
    } finally {
      setStartingPlanSet(false);
    }
  };

  const handleClearAndRunAgain = () => {
    setSelectedProjectId('');
    setRunId(null);
    setPlanSetId(null);
    setPlanSetSubmitted(false);
    setUploadedFilesSummary([]);
    setError(null);
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

      {/* Plan Set Panel - Show when runId, planSetId, and project are selected, but not after submit */}
      {!planSetSubmitted && runId && planSetId && selectedProjectId && (
        <PlanSetPanel
          projectId={selectedProjectId}
          planSetId={planSetId}
          runId={runId}
          scenarioId={scenarioId}
          onPlanSetSubmitted={(info) => {
            setPlanSetSubmitted(true);
            setUploadedFilesSummary(info.files);
          }}
        />
      )}

      {/* Success Card - Show after plan set is submitted */}
      {planSetSubmitted && planSetId && selectedProjectId && (
        <div className="mt-6 rounded-xl border border-green-500 bg-green-950/30 p-4">
          <div className="font-semibold text-green-400 mb-2">
            Initial Plan Set Submitted
          </div>
          <div className="text-xs text-zinc-200 space-y-1">
            <div><span className="font-mono">Project ID:</span> {selectedProjectId}</div>
            <div><span className="font-mono">Plan Set ID:</span> {planSetId}</div>
            {runId && (
              <div><span className="font-mono">Run ID:</span> {runId}</div>
            )}
          </div>
          {uploadedFilesSummary.length > 0 && (
            <div className="mt-3 text-xs text-zinc-300">
              <div className="font-semibold mb-1">Files:</div>
              <ul className="list-disc list-inside space-y-0.5">
                {uploadedFilesSummary.map((f) => (
                  <li key={f.id}>
                    <span className="font-mono">{f.id}</span> — {f.name} ({f.fileTypeName})
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            type="button"
            className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            onClick={handleClearAndRunAgain}
          >
            Clear and Run Again
          </button>
        </div>
      )}
    </div>
  );
}

