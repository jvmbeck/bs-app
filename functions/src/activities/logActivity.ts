import { onCall } from 'firebase-functions/v2/https';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';

const db = getFirestore();

export const logActivity = onCall(async (request) => {
  const user = request.auth?.uid;
  if (!user) throw new Error('Unauthenticated');

  const { opportunityId, companyId, type, description, completedAt } = request.data;

  if (!opportunityId || !companyId || !type) {
    throw new Error('Invalid payload');
  }

  const now = Timestamp.now();

  // 1. Create activity (fact)
  const activityRef = db.collection('activities').doc();

  const activity = {
    userId: user,
    opportunityId,
    companyId,
    type,
    description: description ?? null,
    completedAt: completedAt ? Timestamp.fromMillis(completedAt) : null,
    createdAt: now,
    createdBy: user,
  };

  // 2. Derive date keys
  const dateKey = now.toDate().toISOString().slice(0, 10); // YYYY-MM-DD
  const monthKey = dateKey.slice(0, 7); // YYYY-MM

  const userStatsRef = db.collection('userDailyStats').doc(`${user}_${dateKey}`);

  const orgStatsRef = db.collection('orgMonthlyStats').doc(monthKey);

  // 3. Atomic batch
  const batch = db.batch();

  batch.set(activityRef, activity);

  batch.set(
    userStatsRef,
    {
      userId: user,
      date: dateKey,
      activitiesCompleted: FieldValue.increment(1),
      ...(type === 'Ligação' && { callsMade: FieldValue.increment(1) }),
      ...(type === 'E-mail' && { emailsSent: FieldValue.increment(1) }),
      ...(type === 'Reunião' && { meetingsHeld: FieldValue.increment(1) }),
    },
    { merge: true },
  );

  batch.set(
    orgStatsRef,
    {
      month: monthKey,
      totalActivities: FieldValue.increment(1),
    },
    { merge: true },
  );

  await batch.commit();

  return { success: true };
});
