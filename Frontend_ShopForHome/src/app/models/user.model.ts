export interface User {
  id: number;
  fullName: string;
  email: string;
  password?: string;   // optional when sending to backend
  role: string;
  createdAt: string;
  updatedAt: string;
}
