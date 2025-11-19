import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import PlanSetFileCard from './PlanSetFileCard';
import PrimaryButton from '../ui/PrimaryButton';
import LoadingSpinner from '../ui/LoadingSpinner';

interface PlanSetPanelProps {
  projectId: string;
  runId: string;
  scenarioId: string;
  onPlanSetSubmitted?: () => void;
}

export default function PlanSetPanel({
  projectId,
  runId,
  scenarioId,
  onPlanSetSubmitted,
}: PlanSetPanelProps) {
  const [planSetId, setPlanSetId] = useState<string | null>(null);
  const [fileTypes, setFileTypes] = useState<Array<{ id: string; code: string; name: string }>>(
    []
  );
  const [uploadedFileCount, setUploadedFileCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1) Ensure INITIAL plan set exists
  useEffect(() => {
    const ensurePlanSet = async () => {
      if (!projectId) return;

      try {
        // Try to find existing INITIAL plan set
        const { data: existing, error: existingError } = await supabase
          .from('plan_sets')
          .select('id')
          .eq('project_id', projectId)
          .eq('type', 'INITIAL')
          .is('deleted_at', null)
          .maybeSingle();

        if (!existingError && existing?.id) {
          setPlanSetId(existing.id);
          return;
        }

        // Guardrail: Check if INITIAL plan set exists (race condition safety)
        // TODO: This guardrail should be moved to edge function (complete_upload) when created
        // For now, this provides frontend safety. The view v_projects_without_initial_plan_set
        // already filters eligible projects, but this prevents race conditions.
        const { data: guardrailCheck, error: guardrailError } = await supabase
          .from('plan_sets')
          .select('id')
          .eq('project_id', projectId)
          .eq('type', 'INITIAL')
          .is('deleted_at', null)
          .maybeSingle();

        if (guardrailError) {
          console.error('Guardrail check failed:', guardrailError);
          setSubmitError('Failed to verify project eligibility');
          return;
        }

        if (guardrailCheck?.id) {
          setSubmitError('This project already has an Initial plan set.');
          return;
        }

        // Lookup draft doc status id by code
        const { data: draftStatus, error: draftError } = await supabase
          .from('plan_sets_document_review_field')
          .select('id')
          .eq('code', 'draft')
          .is('deleted_at', null)
          .single();

        if (draftError || !draftStatus?.id) {
          console.error('Failed to lookup draft doc status', draftError);
          setSubmitError('Failed to initialize plan set: could not find draft status');
          return;
        }

        // Get current user for created_by
        const { data: { user } } = await supabase.auth.getUser();
        const createdBy = user?.id || null;

        // Insert new plan set
        const { data: created, error: insertError } = await supabase
          .from('plan_sets')
          .insert({
            project_id: projectId,
            type: 'INITIAL',
            document_review_status_id: draftStatus.id,
            created_by: createdBy,
          })
          .select('id')
          .single();

        if (insertError || !created?.id) {
          console.error('Failed to create INITIAL plan set', insertError);
          setSubmitError('Failed to create plan set');
          return;
        }

        setPlanSetId(created.id);

        // TestLab logging: Log plan_sets record
        // Note: files and plan_sets__files logging should be in edge functions (init_upload/complete_upload)
        if (runId && scenarioId) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            const { error: logError } = await supabase.rpc('testlab_log_record', {
              p_run_id: runId,
              p_scenario_id: scenarioId,
              p_table_name: 'plan_sets',
              p_record_id: created.id,
              p_created_by: user?.id || null,
              p_table_id: null,
            });

            if (logError) {
              console.error('Failed to log plan_sets test record:', logError);
              // Don't throw - logging failure shouldn't break the flow
            }
          } catch (logErr) {
            console.error('Error logging plan_sets test record:', logErr);
            // Don't throw - logging failure shouldn't break the flow
          }
        }
      } catch (err) {
        console.error('Error ensuring plan set:', err);
        setSubmitError('Failed to initialize plan set');
      }
    };

    void ensurePlanSet();
  }, [projectId]);

  // 2) Load CLIENT_PLAN_INPUT file types
  useEffect(() => {
    const loadFileTypes = async () => {
      try {
        // First get the group_id for CLIENT_PLAN_INPUT
        const { data: group, error: groupError } = await supabase
          .from('plan_file_type_groups')
          .select('id')
          .eq('code', 'CLIENT_PLAN_INPUT')
          .is('deleted_at', null)
          .single();

        if (groupError || !group?.id) {
          console.error('Failed to load file type group', groupError);
          return;
        }

        // Then get file types for this group
        const { data, error } = await supabase
          .from('plan_sets_file_types')
          .select('id, code, name')
          .eq('group_id', group.id)
          .eq('active', true)
          .is('deleted_at', null)
          .order('name', { ascending: true });

        if (error) {
          console.error('Failed to load plan set file types', error);
          return;
        }

        setFileTypes(data || []);
      } catch (err) {
        console.error('Error loading file types:', err);
      } finally {
        setIsLoading(false);
      }
    };

    void loadFileTypes();
  }, []);

  const handleCardUploaded = useCallback(() => {
    setUploadedFileCount((count) => count + 1);
    setSubmitError(null);
  }, []);

  const handleCardFileRemoved = useCallback(() => {
    setUploadedFileCount((count) => Math.max(0, count - 1));
  }, []);

  const hasAnyUploaded = uploadedFileCount > 0;

  const handleSubmit = useCallback(async () => {
    if (!planSetId || !projectId) return;

    setSubmitError(null);

    if (!hasAnyUploaded) {
      setSubmitError('Attach at least one plan document before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Lookup status IDs by code
      const [awaitingDocStatusRes, intakePhaseRes, newSubmissionPhaseStatusRes] =
        await Promise.all([
          supabase
            .from('plan_sets_document_review_field')
            .select('id')
            .eq('code', 'awaiting_review')
            .is('deleted_at', null)
            .single(),
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
        awaitingDocStatusRes.error ||
        !awaitingDocStatusRes.data?.id ||
        intakePhaseRes.error ||
        !intakePhaseRes.data?.id ||
        newSubmissionPhaseStatusRes.error ||
        !newSubmissionPhaseStatusRes.data?.id
      ) {
        console.error('Status lookup errors', {
          awaitingDocStatusRes,
          intakePhaseRes,
          newSubmissionPhaseStatusRes,
        });
        setSubmitError('Failed to resolve status values.');
        setIsSubmitting(false);
        return;
      }

      const awaitingDocStatusId = awaitingDocStatusRes.data.id;
      const intakePhaseId = intakePhaseRes.data.id;
      const newSubmissionPhaseStatusId = newSubmissionPhaseStatusRes.data.id;

      // Get current user for updated_by
      const { data: { user } } = await supabase.auth.getUser();
      const updatedBy = user?.id || null;

      // Update plan_sets + projects
      const [planSetUpdate, projectUpdate] = await Promise.all([
        supabase
          .from('plan_sets')
          .update({
            document_review_status_id: awaitingDocStatusId,
            updated_by: updatedBy,
          })
          .eq('id', planSetId),
        supabase
          .from('projects')
          .update({
            phase_id: intakePhaseId,
            status_id: newSubmissionPhaseStatusId,
            updated_by: updatedBy,
          })
          .eq('id', projectId),
      ]);

      if (planSetUpdate.error || projectUpdate.error) {
        console.error('Submit updates failed', { planSetUpdate, projectUpdate });
        setSubmitError('Failed to submit plan set.');
        setIsSubmitting(false);
        return;
      }

      // Success - notify parent if callback provided
      setSubmitError(null);
      if (onPlanSetSubmitted) {
        onPlanSetSubmitted();
      }
    } catch (err: any) {
      console.error('Submit error:', err);
      setSubmitError(err.message || 'Failed to submit plan set.');
    } finally {
      setIsSubmitting(false);
    }
  }, [planSetId, projectId, hasAnyUploaded, onPlanSetSubmitted]);

  if (isLoading) {
    return (
      <div className="mt-6 flex items-center gap-2 text-fcc-white/70">
        <LoadingSpinner />
        <span>Loading plan set...</span>
      </div>
    );
  }

  if (!planSetId) {
    return (
      <div className="mt-6 text-sm text-fcc-white/70">
        Preparing plan set…
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
                onFileUploaded={handleCardUploaded}
                onFileRemoved={handleCardFileRemoved}
                runId={runId}
                scenarioId={scenarioId}
              />
            ))}
          </div>

      {fileTypes.length === 0 && (
        <div className="text-sm text-fcc-white/70">
          No file types found for CLIENT_PLAN_INPUT group.
        </div>
      )}

      <div className="flex flex-col gap-2">
        <PrimaryButton
          type="button"
          disabled={!hasAnyUploaded || isSubmitting}
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

