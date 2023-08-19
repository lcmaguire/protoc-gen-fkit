
import { addDoc, getDoc, getDocs, query, updateDoc, type DocumentData, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

import { collection, doc, setDoc } from "firebase/firestore";

export async function dbReadWithID(docPath: string) {
  const docRef = doc(db, docPath);
  const docSnap = await getDoc(docRef);
  return { uid: docSnap.id, path:docSnap.ref.path, message: docSnap.data()}
}

export async function dbList(collectionPath: string) {
  let response: any[] = []
  const querySnapshot = await getDocs(collection(db, collectionPath));
  querySnapshot.forEach((doc) => {
      response.push({ uid: doc.id, path:doc.ref.path ,message: doc.data()})
  });
  return response
}

export async function dbAdd(collectionPath: string, input: any): Promise<string> {
  const docRef = await addDoc(collection(db, collectionPath), input)
  return docRef.id // todo consider returning ref / full obj
}

export async function dbSet(docPath: string, input: any) {
  const docRef = doc(db, docPath);
  await setDoc(docRef, input)
  return docRef.id // todo consider returning ref / full obj
}

export async function dbUpdate(docPath: string, input: any) {
  const docRef = doc(db, docPath);
  await updateDoc(docRef, { input });
}

export async function dbDelete(docPath: string) {
  const docRef = doc(db, docPath);
  await deleteDoc(docRef)
}


