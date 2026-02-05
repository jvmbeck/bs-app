import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { fetchUserDailyStats } from 'src/services/stats';
import type { UserDailyStatsModel as DailyStat } from 'src/models/FirestoreModels';

export const useDailyStatsStore = defineStore('dailyStats', () => {
  // ──────────────────
  // State
  // ──────────────────
  const statsByDate = ref<Record<string, DailyStat>>({});
  const loading = ref(false);

  const range = ref({
    from: '',
    to: '',
  });

  // ──────────────────
  // Getters
  // ──────────────────
  const statsArray = computed(() => Object.values(statsByDate.value));

  const totals = computed(() => {
    return statsArray.value.reduce(
      (acc, day) => {
        acc.opportunitiesCreated += day.opportunitiesCreated ?? 0;
        acc.opportunitiesClosedWon += day.opportunitiesClosedWon ?? 0;
        acc.calls += day.calls ?? 0;
        acc.meetings += day.meetings ?? 0;
        acc.emails += day.emails ?? 0;
        acc.activitiesCompleted += day.activitiesCompleted ?? 0;
        return acc;
      },
      {
        actions: 0,
        opportunitiesCreated: 0,
        opportunitiesClosedWon: 0,
        calls: 0,
        meetings: 0,
        emails: 0,
        activitiesCompleted: 0,
      },
    );
  });

  // ──────────────────
  // Actions
  // ──────────────────
  async function fetchRange(userId: string, from: string, to: string) {
    loading.value = true;
    statsByDate.value = {};
    range.value = { from, to };

    const stats = await fetchUserDailyStats(userId, from, to);

    for (const stat of stats) {
      statsByDate.value[stat.date] = stat;
    }

    loading.value = false;
  }

  function clear() {
    statsByDate.value = {};
    range.value = { from: '', to: '' };
  }

  return {
    // state
    statsByDate,
    loading,
    range,

    // getters
    statsArray,
    totals,

    // actions
    fetchRange,
    clear,
  };
});
