import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from 'src/key/configKey';
import type { UserDailyStatsModel } from 'src/models/FirestoreModels';

export async function fetchUserDailyStats(
  userId: string,
  from: string,
  to: string,
): Promise<UserDailyStatsModel[]> {
  const q = query(
    collection(db, 'userDailyStats'),
    where('userId', '==', userId),
    where('date', '>=', from),
    where('date', '<=', to),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => doc.data() as UserDailyStatsModel);
}
