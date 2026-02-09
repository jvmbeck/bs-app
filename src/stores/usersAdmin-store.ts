import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchAllUsers } from 'src/services/users/index';
import type { UserAdminDTO } from 'src/services/users/index';

export const useUsersAdminStore = defineStore('usersAdmin', () => {
  // ──────────────────
  // State
  // ──────────────────
  const users = ref<UserAdminDTO[]>([]);
  const loading = ref(false);
  const loaded = ref(false);

  // ──────────────────
  // Actions
  // ──────────────────
  async function loadUsers() {
    if (loaded.value) return;

    loading.value = true;

    try {
      users.value = await fetchAllUsers();
      loaded.value = true;
    } finally {
      loading.value = false;
    }
  }

  function refresh() {
    loaded.value = false;
    users.value = [];
    return loadUsers();
  }

  return {
    users,
    loading,
    loadUsers,
    refresh,
  };
});
