import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchActiveUsersOptions } from 'src/services/users/index';
import type { UserOptionDTO } from 'src/services/users/index';

export const useUserDirectoryStore = defineStore('userDirectory', () => {
  // ──────────────────
  // State
  // ──────────────────
  const users = ref<UserOptionDTO[]>([]);
  const loading = ref(false);
  const loaded = ref(false);

  // ──────────────────
  // Actions
  // ──────────────────
  async function loadActiveUsers() {
    if (loaded.value) return;

    loading.value = true;

    try {
      users.value = await fetchActiveUsersOptions();
      loaded.value = true;
    } finally {
      loading.value = false;
    }
  }

  function reset() {
    users.value = [];
    loaded.value = false;
  }

  return {
    users,
    loading,
    loadActiveUsers,
    reset,
  };
});
