
import { addDoc, getDoc, getDocs, query, updateDoc, type DocumentData, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

import { collection, doc, setDoc } from "firebase/firestore";


const collectionPath = "test"

export async function dbReadWithID(id: string) {
    const docRef = doc(db, collectionPath, id);
    const docSnap = await getDoc(docRef);
    return docSnap.data()
}

// todo set this up to be based upon id or other field
export async function dbList() {
    let response: any[] = []
    const querySnapshot = await getDocs(collection(db, collectionPath));
    querySnapshot.forEach((doc) => {
        response.push(doc.data())
    });
    return response
}

export async function dbAdd(input: any): Promise<string> {
    const docRef = await addDoc(collection(db, collectionPath), input)
    return docRef.id
}

export async function dbSet(input: { name?: any; }) {
    console.log("in dbSet")
    const docRef = doc(db, collectionPath, input.name);
    await setDoc(docRef, input)
    return docRef.id
}

export async function dbUpdate(input: { name?: any; }) {
    const docRef = doc(db, collectionPath, input.name);
    await updateDoc(docRef, { input });
}

export async function dbDelete(id: string) {
    const docRef = doc(db, collectionPath, id);
    await deleteDoc(docRef)
}

