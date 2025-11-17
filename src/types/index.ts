export interface TestScenario {
  id: string;
  name: string;
  description: string | null;
  call_function: string;
  active: boolean;
  metadata: Record<string, any>;
  created_at: string;
  created_by: string | null;
}

export interface TestRun {
  id: string;
  scenario_id: string;
  run_at: string;
  run_by: string | null;
  purged_at: string | null;
  purged_by: string | null;
  purge_reason: string | null;
}

export interface TestRecord {
  id: number;
  run_id: string;
  scenario_id: string;
  table_name: string;
  table_id: string | null;
  record_id: string;
  created_at: string;
  created_by: string | null;
}

export interface ActivityLog {
  id: number;
  occurred_at: string;
  actor_id: string | null;
  actor_type: string | null;
  action: string;
  target_table: string | null;
  target_id: string | null;
  context: Record<string, any>;
}

export interface BuildingDepartment {
  id: string;
  name: string;
}

export interface ProjectType {
  id: string;
  name: string;
}

export interface Occupancy {
  id: string;
  name: string;
}

export interface ConstructionType {
  id: string;
  name: string;
}

export interface ProjectPhase {
  id: string;
  name: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface Contact {
  id: string;
  name: string;
}



