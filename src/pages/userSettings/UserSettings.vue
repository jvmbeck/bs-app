<template>
  <div class="info-card-container">
    <q-card class="info-card vertical-middle">
      <q-card-section horizontal class="q-pa-md avatar">
        <q-avatar color="primary">
          <div class="full-center avatar-initials">
            {{
              (userStore.user?.name || '')
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()
            }}
          </div>
        </q-avatar>

        <q-card-section class="text-subtitle1">
          <div>
            Nome: <span class="text-weight-bold">{{ userStore.user?.name }}</span>
          </div>
          <div>
            Email: <span class="text-weight-bold">{{ userStore.user?.email }}</span>
          </div>
          <div>
            Cargo: <span class="text-weight-bold">{{ userStore.user?.role }}</span>
          </div>
        </q-card-section>
      </q-card-section>

      <q-separator />
    </q-card>

    <div class="q-gutter-y-md q-pt-lg" style="max-width: 800px">
      <q-tabs v-model="activeView" indicator-color="transparent" class="">
        <q-tab class="text-blue" name="one" icon="mdi-account-card" label="Usuários" />
        <q-tab class="text-blue" name="two" icon="mdi-cog" label="Second" />
      </q-tabs>
      <q-tab-panels v-model="activeView">
        <q-tab-panel name="one">
          <UsersList />
        </q-tab-panel>

        <q-tab-panel name="two">
          <test-component />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from 'src/stores/user-store';
import UsersList from 'src/components/userSettings/UsersList.vue';
import TestComponent from 'src/components/userSettings/TestComponent.vue';

const userStore = useUserStore();

const activeView = ref('one');
</script>

<style>
.info-card-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.info-card {
  width: 400px;
}

.avatar {
  display: flex;
  align-items: center;
}
</style>
