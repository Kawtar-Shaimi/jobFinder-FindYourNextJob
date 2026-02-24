export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
