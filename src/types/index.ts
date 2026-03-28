export interface User {
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
