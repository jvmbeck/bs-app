import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { fetchUserDailyStats } from 'src/services/stats';
import type { UserDailyStatsModel as DailyStat } from 'src/models/FirestoreModels';
import type { TodayStatsView, DailyStatsTableRow } from 'src/models/ViewModels';
import { formatDate, daysAgo } from 'src/utils/date';

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
  const statsArray = computed(() =>
    Object.values(statsByDate.value).sort((a, b) => a.date.localeCompare(b.date)),
  );
  const totals = computed(() => {
    return statsArray.value.reduce(
      (acc, day) => {
        acc.actions += (day.calls ?? 0) + (day.meetings ?? 0) + (day.emails ?? 0);
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

  const todayStats = computed<TodayStatsView>(() => {
    const today = formatDate(new Date());
    const day = statsByDate.value[today];

    if (!day) {
      return {
        actions: 0,
        opportunitiesCreated: 0,
        opportunitiesClosedWon: 0,
        calls: 0,
        meetings: 0,
        emails: 0,
        activitiesCompleted: 0,
      };
    }

    const calls = day.calls ?? 0;
    const meetings = day.meetings ?? 0;
    const emails = day.emails ?? 0;

    return {
      actions: calls + meetings + emails,
      opportunitiesCreated: day.opportunitiesCreated ?? 0,
      opportunitiesClosedWon: day.opportunitiesClosedWon ?? 0,
      calls,
      meetings,
      emails,
      activitiesCompleted: day.activitiesCompleted ?? 0,
    };
  });

  const tableRows = computed<DailyStatsTableRow[]>(() =>
    statsArray.value.map((day) => {
      const calls = day.calls ?? 0;
      const meetings = day.meetings ?? 0;
      const emails = day.emails ?? 0;

      return {
        date: day.date,
        actions: calls + meetings + emails,
        opportunitiesCreated: day.opportunitiesCreated ?? 0,
        opportunitiesClosedWon: day.opportunitiesClosedWon ?? 0,
        calls,
        meetings,
        emails,
        activitiesCompleted: day.activitiesCompleted ?? 0,
      };
    }),
  );

  // ──────────────────
  // Actions
  // ──────────────────
  async function fetchRange(userId: string, from: string, to: string) {
    console.log(
      'DAILY STATS STORE:\n\nFetching daily stats from',
      from,
      'to',
      to,
      'for user',
      userId,
    );

    loading.value = true;
    statsByDate.value = {};
    range.value = { from, to };

    const stats = await fetchUserDailyStats(userId, from, to);

    for (const stat of stats) {
      statsByDate.value[stat.date] = stat;
    }

    loading.value = false;
  }

  /**
   * Convenience method for the dashboard
   */
  function fetchLast7Days(userId: string) {
    const from = daysAgo(6);
    const to = formatDate(new Date());
    return fetchRange(userId, from, to);
  }
  function clear() {
    statsByDate.value = {};
    range.value = { from: '', to: '' };
  }

  return {
    // state
    todayStats,
    statsByDate,
    tableRows,
    loading,
    range,

    // getters
    statsArray,
    totals,

    // actions
    fetchRange,
    fetchLast7Days,
    clear,
  };
});
