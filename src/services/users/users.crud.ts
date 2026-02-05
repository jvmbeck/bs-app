import { db } from 'src/key/configKey';
import { doc, getDoc } from 'firebase/firestore';
import type { UserModel } from 'src/models/FirestoreModels';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function getUserById(uid: string): Promise<UserModel | null> {
  return await getDoc(doc(db, 'users', uid)).then((snap) => {
    if (snap.exists()) {
      return snap.data() as UserModel;
    }
    return null;
  });
}

export interface UserOptionDTO {
  id: string;
  name: string;
}

export async function fetchActiveUsersOptions(): Promise<UserOptionDTO[]> {
  const q = query(collection(db, 'users'), where('active', '==', true));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
  }));
}
