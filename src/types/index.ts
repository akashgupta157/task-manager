export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  created_by: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  project_id: string;
  assigned_to: string;
  created_by: string;
  created_at: string;
}
