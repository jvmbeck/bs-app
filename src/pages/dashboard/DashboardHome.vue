<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h6">Resumo Diário</div>
      <q-space />
      <q-btn
        label="Atualizar"
        icon="refresh"
        flat
        :loading="statsStore.loading"
        @click="refreshDashboard"
      />
    </div>

    <div class="row q-col-gutter-md">
      <q-card class="col-12 col-md-3">
        <q-card-section>
          <div class="text-caption">Total de ações</div>
          <div class="text-h5">{{ statsStore.todayStats.actions }}</div>
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-md-3">
        <q-card-section>
          <div class="text-caption">Oportunidades criados</div>
          <div class="text-h5">{{ statsStore.todayStats.opportunitiesCreated }}</div>
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-md-3">
        <q-card-section>
          <div class="text-caption">Oportunidades ganhos</div>
          <div class="text-h5">{{ statsStore.todayStats.opportunitiesClosedWon }}</div>
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-md-3">
        <q-card-section>
          <div class="text-caption">Chamadas</div>
          <div class="text-h5">{{ statsStore.todayStats.calls }}</div>
        </q-card-section>
      </q-card>
      <q-card class="col-12 col-md-3">
        <q-card-section>
          <div class="text-caption">Reuniões</div>
          <div class="text-h5">{{ statsStore.todayStats.meetings }}</div>
        </q-card-section>
      </q-card>
      <q-card class="col-12 col-md-3">
        <q-card-section>
          <div class="text-caption">E-mails</div>
          <div class="text-h5">{{ statsStore.todayStats.emails }}</div>
        </q-card-section>
      </q-card>
      <q-card class="col-12 col-md-3">
        <q-card-section>
          <div class="text-caption">Atividades concluídas</div>
          <div class="text-h5">{{ statsStore.todayStats.activitiesCompleted }}</div>
        </q-card-section>
      </q-card>
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
 * This page intentionally:
 * - Does NOT use onMounted
 * - Does NOT assume auth is immediately available
 * - Does NOT store date range in reactive state
 */

import { watch } from 'vue';
import { useDailyStatsStore } from 'src/stores/dailyStats-store';
import { useUserStore } from 'src/stores/user-store';
import { formatDate, daysAgo } from 'src/utils/date';

// Pinia stores
const statsStore = useDailyStatsStore();
const userStore = useUserStore();

function refreshDashboard() {
  if (!userStore.authUser) return;
  void statsStore.fetchLast7Days(userStore.authUser.uid);
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
     * Date range for the dashboard.
     * These are plain strings, not refs, because:
     * - They are required
     * - They are not user-editable
     * - They should never be undefined
     */
    const from: string = daysAgo(6); // Last 7 days includes today
    const to: string = formatDate(new Date());

    /**
     * Fetch aggregated stats.
     * Awaited to satisfy:
     * - ESLint no-floating-promises
     * - Predictable loading state
     */
    void statsStore.fetchRange(authUser.uid, from, to);
  },
  {
    // Run immediately AND on UID changes
    immediate: true,
  },
);
</script>
