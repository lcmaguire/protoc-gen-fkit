import { DescMessage } from "@bufbuild/protobuf"
import { Schema } from "@bufbuild/protoplugin"


export function parseTemplate(html: string) {

    const getTplate = `
<script>
  // @ts-nocheck
  export let message;

</script>

{#if message != null}
  ${html}
{/if}

`
  return getTplate
}

export function page() {

}

// todo see how proto generates fieldnames.
export function snakeCaseToCamelCase(input: string) {
  for (let i = 0; i < input.length; i++) {
    let res = input.replace("_", "")
    if (res == input) {
      continue
    }
    let undrescoreIndex = input.indexOf("_")
    input = res
    input = input.substring(0, undrescoreIndex) + input.charAt(undrescoreIndex).toLocaleUpperCase() + input.substring(undrescoreIndex + 1)

  }
  return input
}

export function protoCamelCase(snakeCase: string): string {
  let capNext = false;
  let a = ""
  for (let i = 0; i < snakeCase.length; i++) {
    let c = snakeCase.charAt(i);
    switch (c) {
      case "_":
        capNext = true;
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        a = a + c
        capNext = false;
        break;
      default:
        if (capNext) {
          capNext = false;
          c = c.toUpperCase();
        }
        a = a + c
        break;
    }
  }
  return a;
}


// note, this should probably be an external pkg that is imported and initialized via env vars.
export function genFirebase(schema: Schema){
  const firebaseTemplate = `
  
// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "TODO REPLACE WITH YOUR VALUE",
  authDomain: "TODO REPLACE WITH YOUR VALUE",
  projectId: "TODO REPLACE WITH YOUR VALUE",
  storageBucket: "TODO REPLACE WITH YOUR VALUE",
  messagingSenderId: "TODO REPLACE WITH YOUR VALUE",
  appId: "TODO REPLACE WITH YOUR VALUE",
  measurementId: "TODO REPLACE WITH YOUR VALUE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export {app};
`

const firestoreTemplate = `
import { addDoc, getDoc, getDocs, query, updateDoc, type DocumentData, deleteDoc, getFirestore } from "firebase/firestore";
import { app } from "./firebase";

import { collection, doc, setDoc } from "firebase/firestore";


const collectionPath = "test"

// Initialzie firestore db.
const db = getFirestore(app);

export {db}

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
`

const authTemplate = `
import {getAuth, GoogleAuthProvider, type User}  from "firebase/auth";
import {app} from "./firebase"

// Initialize firebase authentication.
const auth = getAuth(app);

async function authenticateRequest(user : User){
    let token = await user.getIdToken(false)

    let headers = new Headers();
    headers.set("Authorization", "Bearer " + token);
    return headers
}

// todo include all auth providers
const provider = new GoogleAuthProvider();

function getUser() :User | null{
    return auth.currentUser
}


export { auth, authenticateRequest, provider, getUser };
`

let dir = "firebase"
const firebase = schema.generateFile(`${dir}/firebase.ts`);
firebase.print(firebaseTemplate)

const firestore = schema.generateFile(`${dir}/firestore.ts`);
firestore.print(firestoreTemplate)

const auth = schema.generateFile(`${dir}/auth.ts`);
auth.print(authTemplate)
}