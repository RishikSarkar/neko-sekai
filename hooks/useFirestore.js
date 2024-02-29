import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

export function useFirestore() {
    const db = getFirestore();

    const savePetData = async (userId, petData) => {
        await setDoc(doc(db, "users", userId), { petData });
    };

    const fetchPetData = async (userId) => {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    };

    return { savePetData, fetchPetData };
}