import { auth, functions } from 'src/key/configKey';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import type { CreateUserPayload, CreateUserResponse } from 'src/models/Payloads';

const createUserCallable = httpsCallable<CreateUserPayload, CreateUserResponse>(
  functions,
  'createUser',
);

export async function createUser(payload: CreateUserPayload): Promise<CreateUserResponse> {
  const result = await createUserCallable(payload);
  console.log(
    'AUTH.SERVICES: \n\nThis is result.data returned to the store when registering a new user: ',
    result.data,
  );

  return result.data;
}

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
