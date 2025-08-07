export type Task = {
  name: string;
  status: 'todo' | 'in_progress' | 'done';
};

export type User = {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  role: 'admin' | 'user' | 'manager';
  isActive?: boolean;
  tasks?: Task[];
};
