import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const db = getFirestore();
const auth = getAuth();

export const createUser = onCall(async (request) => {
  const callerUid = request.auth?.uid;
  if (!callerUid) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }

  // 1. Check caller role
  const callerSnap = await db.doc(`users/${callerUid}`).get();
  if (!callerSnap.exists || callerSnap.data()?.role !== 'Administrador') {
    throw new HttpsError('permission-denied', 'Admin access required');
  }

  const { email, name, role } = request.data;

  if (!email || !name || !role) {
    throw new HttpsError('invalid-argument', 'Missing required fields');
  }

  if (!['Vendas', 'Supervisor'].includes(role)) {
    throw new HttpsError('invalid-argument', 'Invalid role');
  }

  // 2. Create Auth user
  const userRecord = await auth.createUser({
    email,
    displayName: name,
    disabled: false,
  });

  // 3. Create Firestore profile
  await db.doc(`users/${userRecord.uid}`).set({
    name,
    email,
    role,
    active: true,
    createdAt: FieldValue.serverTimestamp(),
    createdBy: callerUid,
  });

  return { uid: userRecord.uid };
});
