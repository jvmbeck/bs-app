import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { loginUser, createUser, logoutUser } from 'src/services/auth/index';
import type { UserModel } from 'src/models/FirestoreModels';
import type { CreateUserPayload, CreateUserResponse } from 'src/models/Payloads';
import type { User as FirebaseUser } from 'firebase/auth';
import { getUserById } from 'src/services/users/index';

export const useUserStore = defineStore('user', () => {
  const authUser = ref<FirebaseUser | null>(null);
  const user = ref<UserModel | null>(null);
  const loading = ref(false);
  const authReady = ref(false);
  const error = ref<string | null>(null);
  const createdUser = ref<CreateUserResponse | null>(null);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === 'Administrador');

  async function login(email: string, password: string) {
    loading.value = true;
    error.value = null;
    authReady.value = false;

    try {
      console.log('USER STORE: \nEntered try bracket in login function');

      await loginUser(email, password);

      // Wait for authReady to be set to true (when user profile is fetched)
      while (!authReady.value) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      console.log('Login successful, user profile loaded:', user.value);
    } catch (err) {
      error.value = 'Invalid email or password';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function register(
    email: string,
    name: string,
    role: CreateUserPayload['role'],
  ): Promise<CreateUserResponse> {
    loading.value = true;
    error.value = null;

    try {
      const created = await createUser({
        email,
        name,
        role,
      });
      console.log('STORE CREATED USER: ', created);

      createdUser.value = created;
      return created;
    } finally {
      loading.value = false;
      console.log('USER-STORE: \n\ncreatedUser.value is: ', createdUser.value);
    }
  }

  async function logout() {
    await logoutUser();
    user.value = null;
  }

  async function setAuthUser(firebaseUser: FirebaseUser | null): Promise<void> {
    loading.value = true;

    try {
      authUser.value = firebaseUser;
    } finally {
      console.log('Auth User loaded: ', authUser.value);
      await fetchUserProfile();
      console.log('isAuth: ', isAuthenticated.value);
      loading.value = false;
      authReady.value = true;
    }

    if (!firebaseUser) {
      user.value = null;
    }
  }

  async function fetchUserProfile() {
    if (authUser.value) {
      loading.value = true;
      try {
        user.value = await getUserById(authUser.value.uid);
        console.log('Fetched user profile: ', user.value);
      } catch (err) {
        error.value = 'Failed to fetch user profile';
        throw err;
      } finally {
        loading.value = false;
      }
    } else {
      user.value = null;
    }
  }

  return {
    user,
    createdUser,
    loading,
    authReady,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    setAuthUser,
  };
});
