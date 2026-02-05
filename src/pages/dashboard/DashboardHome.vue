<template>
  <q-page class="q-pa-md">
    <div class="filters">
      <q-select
        class="user-filter q-mb-md"
        v-model="selectedUserId"
        label="Selecione o usuário"
        :options="userDirectory.users"
        option-label="name"
        option-value="id"
        emit-value
        map-options
        :loading="userDirectory.loading"
        @focus="onUserSelectFocus"
        rounded
        outlined
      />
      <q-btn
        class="refresh-button"
        label="Atualizar"
        icon="refresh"
        flat
        :loading="statsStore.loading"
        @click="refreshDashboard"
      />
    </div>
    <div class="row items-center q-mb-md">
      <div class="text-h6">Resumo Diário</div>
      <q-space />
    </div>

    <div class="row q-col-gutter-md">
      <div v-for="stat in statCards" :key="stat.label" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <StatCard :label="stat.label" :value="stat.value" />
      </div>
    </div>

    <q-card class="q-mt-lg">
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Visão geral de atividades (Últimos 7 dias)</div>

        <q-table
          :rows="statsStore.tableRows"
          :columns="[
            { name: 'date', label: 'Data', field: 'date' },
            { name: 'actions', label: 'Ações', field: 'actions' },
            { name: 'dealsCreated', label: 'Oportunidades criados', field: 'opportunitiesCreated' },
            { name: 'dealsWon', label: 'Oportunidades ganhos', field: 'opportunitiesClosedWon' },
            { name: 'messages', label: 'Ligações', field: 'calls' },
          ]"
          row-key="date"
          flat
          dense
          :loading="statsStore.loading"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
/**
 * Dashboard page script
 * ---------------------
 * Responsibilities:
 * - Wait for authenticated user
 * - Compute a fixed date range (last 7 days)
 * - Fetch aggregated daily stats via Pinia store
 *
 **/

import { watch, ref, computed } from 'vue';
import { useDailyStatsStore } from 'src/stores/dailyStats-store';
import { useUserDirectoryStore } from 'src/stores/userDirectory-store';
import { useUserStore } from 'src/stores/user-store';
import StatCard from 'src/components/dashboard/StatCard.vue';

// Pinia stores
const statsStore = useDailyStatsStore();
const userStore = useUserStore();
const userDirectory = useUserDirectoryStore();

const selectedUserId = ref<string | null>(null);

function refreshDashboard() {
  if (!userStore.authUser) return;
  void statsStore.fetchLast7Days(selectedUserId.value || userStore.authUser.uid);
}

function onUserSelectFocus() {
  void userDirectory.loadActiveUsers();
}

/**
 * Watch the authenticated user's UID.
 *
 * Why watch instead of onMounted?
 * - Firebase auth is async
 * - UID may not exist on initial render
 * - `immediate: true` handles both cases
 */
watch(
  () => userStore.authUser,
  (authUser) => {
    // Guard: do nothing until UID is available
    if (!authUser) return;

    /**
     * Fetch aggregated stats.
     * Awaited to satisfy:
     * - ESLint no-floating-promises
     * - Predictable loading state
     */
    refreshDashboard();
  },
  {
    // Run immediately AND on UID changes
    immediate: true,
  },
);

const statCards = computed(() => [
  {
    label: 'Total de ações',
    value: statsStore.todayStats.actions,
  },
  {
    label: 'Oportunidades criadas',
    value: statsStore.todayStats.opportunitiesCreated,
  },
  {
    label: 'Oportunidades ganhas',
    value: statsStore.todayStats.opportunitiesClosedWon,
  },
  {
    label: 'Chamadas',
    value: statsStore.todayStats.calls,
  },
  {
    label: 'Reuniões',
    value: statsStore.todayStats.meetings,
  },
  {
    label: 'E-mails',
    value: statsStore.todayStats.emails,
  },
  {
    label: 'Atividades concluídas',
    value: statsStore.todayStats.activitiesCompleted,
  },
]);
</script>

<style>
.daily-stats {
  display: flex;
  flex-wrap: wrap;
}

.filters {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.user-filter {
  width: 450px;
}
.refresh-button {
  margin-left: 16px;
}
</style>
