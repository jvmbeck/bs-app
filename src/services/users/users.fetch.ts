import { db } from 'src/key/configKey';
import { doc, getDoc } from 'firebase/firestore';
import type { UserModel } from 'src/models/FirestoreModels';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export async function getUserById(uid: string): Promise<UserModel | null> {
  return await getDoc(doc(db, 'users', uid)).then((snap) => {
    if (snap.exists()) {
      return snap.data() as UserModel;
    }
    return null;
  });
}

//  this interface and function are used by the user directory store,
//  which is used in the dashboard.
//  The function fetches all active users from the database
//  and returns them as an array of UserOptionDTO objects, which contain the user's id and name.
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

// this interface and function are used by the admin settings panel to fetch all users
// from the database, including their email and role.

export interface UserAdminDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

export async function fetchAllUsers(): Promise<UserAdminDTO[]> {
  const q = query(collection(db, 'users'), orderBy('name'));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.name,
      email: data.email,
      role: data.role,
      active: data.active,
    };
  });
}
