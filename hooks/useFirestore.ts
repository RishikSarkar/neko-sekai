import { getFirestore, doc, setDoc, getDoc, Firestore } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';

export function useFirestore() {
  const db = getFirebaseDb() as Firestore | null;

  const savePetData = async (userId: string, petData: unknown) => {
    if (!db) return;
    await setDoc(doc(db, 'users', userId), { petData });
  };

  const fetchPetData = async (userId: string) => {
    if (!db) return null;
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  };

  return { savePetData, fetchPetData };
}
