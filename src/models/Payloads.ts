export interface CreateUserResponse {
  uid: string;
  email: string;
  resetLink: string;
}

// Data the frontend is allowed to send to the backend
export interface CreateUserPayload {
  email: string;
  name: string;
  role: 'Vendas' | 'Supervisor' | 'Administrador';
}
