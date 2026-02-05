// this is used to define the structure of today's statistics data that will be shown on the dashboard
// it matches the computed property 'todayStats' in the dailyStats-store.ts
// ensuring type safety when accessing today's stats in the dashboard component

export interface TodayStatsView {
  actions: number;
  opportunitiesCreated: number;
  opportunitiesClosedWon: number;
  calls: number;
  meetings: number;
  emails: number;
  activitiesCompleted: number;
}

// this one is used for the rows in the daily stats table on the dashboard
// it includes actions as a total of calls + meetings + emails, and also includes the date for each row

export interface DailyStatsTableRow {
  date: string;
  actions: number;
  opportunitiesCreated: number;
  opportunitiesClosedWon: number;
  calls: number;
  meetings: number;
  emails: number;
  activitiesCompleted: number;
}
