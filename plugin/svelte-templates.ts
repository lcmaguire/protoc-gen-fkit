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

export function parseAllcomponent(messageName: string,) {

  const viewName = `View${messageName}`
  const writeName = `Write${messageName}`
  const allTemplate = `
<script>
	// @ts-nocheck
	// @ts-ignore

	import ${viewName} from './${viewName}.svelte';
	import ${writeName} from './${writeName}.svelte';

	// todo do this on successful write ? https://kit.svelte.dev/docs/modules#$app-navigation-invalidateall 

	export let data;
  export let writeFunc;
  export let deleteFunc;

	let editable = false;

	function toggle() {
		editable = !editable;
	}

</script>

{#if data != null && !editable}
	<${viewName} message={data} />
{/if}

{#if editable }
	<${writeName} bind:message={data} />

	<button on:click={writeFunc}> save </button>
{/if}

{#if  writeFunc != null }
	<button on:click={toggle}> edit </button>
{/if}

<button on:click={deleteFunc}> Delete </button>

  `

  return allTemplate
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
export function genFirebase(schema: Schema) {
  const firebaseTemplate = `
  
// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

// Initialize firebase authentication.
const auth = getAuth(app);

// Initialzie firestore db.
const db = getFirestore(app);

export {app, auth, db};
`

  const firestoreTemplate = `
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
`

  const authTemplate = `
import {GoogleAuthProvider, type User}  from "firebase/auth";
import {auth} from "./firebase"

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

export {authenticateRequest, provider, getUser };
`

  let dir = "lib/firebase"
  const firebase = schema.generateFile(`${dir}/firebase.ts`);
  firebase.print(firebaseTemplate)

  const firestore = schema.generateFile(`${dir}/firestore.ts`);
  firestore.print(firestoreTemplate)

  const auth = schema.generateFile(`${dir}/auth.ts`);
  auth.print(authTemplate)
}

// todo gen these somewhere
export function generateActionFuncs(schema: Schema) {

  // messageName
  const deleteAction = `
  async function deleteDoc() {
		try {
			await dbDelete(data.name);
		} catch (e) {
			console.error(e);
		} finally {
			console.log('We do cleanup here');
			goto("/")
		}
	}

  const writeFunc = async function writeDoc() {
		try {
			await dbSet(data);
		} catch (e) {
			console.error(e);
		} finally {
			goto("/") 
		}
	}
  `
}

export function generateRoutes(schema: Schema, messageName: string) {

  let dir = "routes"
  const viewComponentName = `View${messageName}`

  const listComponentTemplate = `
  <script>
  // @ts-ignore
	import ${viewComponentName} from '$lib/${viewComponentName}.svelte';
	
	export let data;

  </script>

  {#if data != null}
  {#each data.messages as item}
    <${viewComponentName} message={item}/>
  {/each}
 {/if}

  `

  const listComponent = schema.generateFile(`${dir}/${messageName}/+page.svelte`);
  listComponent.print(listComponentTemplate)

  const listJsTemplate = `
  import { error } from '@sveltejs/kit';

  import { dbList } from '$lib/firebase/firestore';
  
   
  /** @type {import('./$types').PageLoad} */
  export async function load() {
     let messages = await dbList()
     return { messages: messages}
  }
  `

  const listJS = schema.generateFile(`${dir}/${messageName}/+page.js`);
  listJS.print(listJsTemplate)

  const allComponentName = `All${messageName}`

  const slugComponentTemplate = `
  <script>
	// @ts-nocheck
	// @ts-ignore

	import ${allComponentName} from '$lib/${allComponentName}.svelte';

	import { dbSet, dbDelete } from '$lib/firebase/firestore';

	import { goto } from '$app/navigation';

	// todo do this on successful write ? https://kit.svelte.dev/docs/modules#$app-navigation-invalidateall 

	export let data;

	const writeFunc = async function writeDoc() {
		try {
			await dbSet(data);
		} catch (e) {
			console.error(e);
		} finally {
			goto("/") // todo determie where i would like to go
		}
	}

	async function deleteDoc() {
		try {
			await dbDelete(data.name);
		} catch (e) {
			console.error(e);
		} finally {
			console.log('We do cleanup here');
			goto("/")
		}
	}
</script>

<${allComponentName} data={data} writeFunc={writeFunc} deleteFunc={deleteDoc}/>
  `
  
  const slugComponent = schema.generateFile(`${dir}/${messageName}/[slug]/+page.svelte`);
  slugComponent.print(slugComponentTemplate)

  const slugJsTemplate = `
  import { error } from '@sveltejs/kit';

  import { dbReadWithID } from '$lib/firebase/firestore';
  
   
  /** @type {import('./$types').PageLoad} */
  export async function load({ params }) {
  
     let message;
     try {
        message = await dbReadWithID(params.slug)
     } catch (e) {
        console.error(e);
     } 
  
     return message
  }
  `
  const slugJs = schema.generateFile(`${dir}/${messageName}/[slug]/+page.js`);
  slugJs.print(slugJsTemplate)
}