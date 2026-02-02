import { db } from 'src/key/configKey';
import { doc, getDoc } from 'firebase/firestore';
import type { UserModel } from 'src/models/FirestoreModels';

export async function getUserById(uid: string): Promise<UserModel | null> {
  return await getDoc(doc(db, 'users', uid)).then((snap) => {
    if (snap.exists()) {
      return snap.data() as UserModel;
    }
    return null;
  });
}
