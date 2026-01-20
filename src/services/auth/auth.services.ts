import { auth, functions } from 'src/key/configKey';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';

// Data the frontend is allowed to send to the backend
export interface CreateUserPayload {
  email: string;
  name: string;
  role: 'Vendas' | 'Supervisor';
}

export const registerUser = async (payload: CreateUserPayload) => {
  const fn = httpsCallable(functions, 'createUser');
  return fn(payload);
};

/**
 * Login user with email and password
 */
export async function loginUser(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

/**
 * Logout
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}
