import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import PlanSetFileCard from './PlanSetFileCard';
import PrimaryButton from '../ui/PrimaryButton';
import LoadingSpinner from '../ui/LoadingSpinner';

interface PlanSetPanelProps {
  projectId: string;
  planSetId: string; // REQUIRED - no longer optional
  runId?: string;
  scenarioId?: string;
  onPlanSetSubmitted?: (info: {
    planSetId: string;
    projectId: string;
    runId?: string | null;
    files: { id: string; name: string; fileTypeName: string }[];
  }) => void;
}

export default function PlanSetPanel({
  projectId,
  planSetId,
  runId,
  scenarioId,
  onPlanSetSubmitted,
}: PlanSetPanelProps) {
  const [fileTypes, setFileTypes] = useState<Array<{ id: string; code: string; name: string }>>(
    []
  );
  const [uploadedFileCount, setUploadedFileCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedFilesByType, setUploadedFilesByType] = useState<
    Record<string, Array<{ id: string; name: string; fileTypeName: string }>>
  >({});

  // Hardcoded CLIENT_PLAN_INPUT group ID for stability
  // This ID remains constant even if the group code or name changes
  const CLIENT_PLAN_INPUT_GROUP_ID = '204fbd17-d408-40d6-b0b5-a0e5d10b4ae1';

  // 2) Load CLIENT_PLAN_INPUT file types
  useEffect(() => {
    const loadFileTypes = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        
        // Directly query file types using the hardcoded group ID
        const { data, error } = await supabase
          .from('plan_sets_file_types')
          .select('id, code, name')
          .eq('group_id', CLIENT_PLAN_INPUT_GROUP_ID)
          .eq('active', true)
          .is('deleted_at', null)
          .order('name', { ascending: true });

        if (error) {
          console.error('Failed to load plan set file types:', error);
          setLoadError(`Failed to load file types: ${error.message}`);
          setFileTypes([]);
          return;
        }

        console.log('Loaded file types:', data);
        setFileTypes(data || []);
        
        if (!data || data.length === 0) {
          console.warn('No file types found for CLIENT_PLAN_INPUT group');
          setLoadError('No active file types found for CLIENT_PLAN_INPUT group. Please check database configuration.');
        } else {
          setLoadError(null); // Clear any previous errors on success
        }
      } catch (err: any) {
        console.error('Error loading file types:', err);
        setLoadError(`Error loading file types: ${err.message || 'Unknown error'}`);
        setFileTypes([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadFileTypes();
  }, []);

  const getAllUploadedFiles = useCallback((): Array<{ id: string; name: string; fileTypeName: string }> => {
    return Object.values(uploadedFilesByType).flat();
  }, [uploadedFilesByType]);

  const handleCardUploaded = useCallback((fileInfo: { id: string; name: string; fileTypeName: string }) => {
    setUploadedFilesByType(prev => ({
      ...prev,
      [fileInfo.fileTypeName]: [...(prev[fileInfo.fileTypeName] || []), fileInfo],
    }));
    setUploadedFileCount((count) => count + 1);
    setSubmitError(null);
  }, []);

  const handleCardFileRemoved = useCallback((fileInfo: { id: string; name: string; fileTypeName: string }) => {
    setUploadedFilesByType(prev => {
      const typeFiles = prev[fileInfo.fileTypeName] || [];
      const updated = typeFiles.filter(f => f.id !== fileInfo.id);
      const newState = { ...prev };
      if (updated.length > 0) {
        newState[fileInfo.fileTypeName] = updated;
      } else {
        delete newState[fileInfo.fileTypeName];
      }
      return newState;
    });
    setUploadedFileCount((count) => Math.max(0, count - 1));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!planSetId || !projectId) return;

    setSubmitError(null);

    const files = getAllUploadedFiles();
    if (files.length === 0) {
      setSubmitError('Attach at least one plan document before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Lookup status IDs by code
      const [intakePhaseRes, newSubmissionPhaseStatusRes] = await Promise.all([
        supabase
          .from('project_phases')
          .select('id')
          .eq('code', 'intake')
          .is('deleted_at', null)
          .single(),
        supabase
          .from('project_phases_status_field')
          .select('id')
          .eq('code', 'new_submission')
          .is('deleted_at', null)
          .single(),
      ]);

      if (
        intakePhaseRes.error ||
        !intakePhaseRes.data?.id ||
        newSubmissionPhaseStatusRes.error ||
        !newSubmissionPhaseStatusRes.data?.id
      ) {
        console.error('Status lookup errors', {
          intakePhaseRes,
          newSubmissionPhaseStatusRes,
        });
        setSubmitError('Failed to resolve status values.');
        setIsSubmitting(false);
        return;
      }

      const intakePhaseId = intakePhaseRes.data.id;
      const newSubmissionPhaseStatusId = newSubmissionPhaseStatusRes.data.id;

      // Get current user for updated_by
      const { data: { user } } = await supabase.auth.getUser();
      const updatedBy = user?.id || null;

      // Update project
      const { error: projectUpdateError } = await supabase
        .from('projects')
        .update({
          phase_id: intakePhaseId,
          status_id: newSubmissionPhaseStatusId,
          current_plan_set_id: planSetId,
          updated_by: updatedBy,
        })
        .eq('id', projectId);

      if (projectUpdateError) {
        console.error('Project update failed', projectUpdateError);
        setSubmitError('Failed to update project status.');
        setIsSubmitting(false);
        return;
      }

      // Create doc_reviews record
      const { data: docReviewInserted, error: docReviewError } = await supabase
        .from('doc_reviews')
        .insert({
          plan_set_id: planSetId,
          status: '019ab788-11a1-78af-f1ff-64337cf65117',
          created_by: updatedBy,
        })
        .select('id')
        .single();

      if (docReviewError) {
        console.error('Failed to create doc_reviews record:', docReviewError);
        setSubmitError('Failed to create document review record.');
        setIsSubmitting(false);
        return;
      }

      // TestLab logging for doc_reviews
      if (runId && scenarioId) {
        try {
          const { error: logError } = await supabase.rpc('testlab_log_record', {
            p_run_id: runId,
            p_scenario_id: scenarioId,
            p_table_name: 'doc_reviews',
            p_record_id: docReviewInserted.id.toString(),
            p_created_by: updatedBy,
            p_table_id: null,
          });
          if (logError) {
            console.error('Failed to log doc_reviews test record:', logError);
          }
        } catch (logErr) {
          console.error('Error logging doc_reviews test record:', logErr);
        }
      }

      // Success - notify parent with file info
      setSubmitError(null);
      if (onPlanSetSubmitted) {
        onPlanSetSubmitted({
          planSetId,
          projectId,
          runId: runId || null,
          files,
        });
      }
    } catch (err: any) {
      console.error('Submit error:', err);
      setSubmitError(err.message || 'Failed to submit plan set.');
    } finally {
      setIsSubmitting(false);
    }
  }, [planSetId, projectId, onPlanSetSubmitted, getAllUploadedFiles, runId]);

  if (isLoading) {
    return (
      <div className="mt-6 flex items-center gap-2 text-fcc-white/70">
        <LoadingSpinner />
        <span>Loading plan set...</span>
      </div>
    );
  }

  return (
    <section className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-fcc-white">Plan Set – INITIAL</h2>
      </div>

          <div className="grid gap-4 md:grid-cols-2">
            {fileTypes.map((ft) => (
              <PlanSetFileCard
                key={ft.id}
                projectId={projectId}
                planSetId={planSetId}
                fileType={ft}
                onFileUploaded={(fileInfo) => handleCardUploaded(fileInfo)}
                onFileRemoved={(fileInfo) => handleCardFileRemoved(fileInfo)}
                runId={runId}
                scenarioId={scenarioId}
              />
            ))}
          </div>

      {fileTypes.length === 0 && !isLoading && (
        <div className="rounded-lg border border-red-500/50 bg-red-950/20 p-4">
          <div className="text-sm text-red-400 font-semibold mb-1">
            No file types found for CLIENT_PLAN_INPUT group
          </div>
          {loadError && (
            <div className="text-xs text-red-300 mt-1">
              {loadError}
            </div>
          )}
          <div className="text-xs text-fcc-white/70 mt-2">
            Please check that file types exist in the database and are associated with the CLIENT_PLAN_INPUT group.
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <PrimaryButton
          type="button"
          disabled={uploadedFileCount === 0 || isSubmitting}
          onClick={handleSubmit}
          className="w-full"
        >
          {isSubmitting ? 'Submitting…' : 'Submit for Review'}
        </PrimaryButton>

        {submitError && (
          <p className="text-sm text-red-500 mt-1">{submitError}</p>
        )}
      </div>
    </section>
  );
}

