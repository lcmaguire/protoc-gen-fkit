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

	export let data;
  export let writeFunc;
  export let deleteFunc;

	let editable = false;

	function toggle() {
		editable = !editable;
	}

  // this will toggle from edit view to just view 
  function writeWrapper () {
		writeFunc()
		toggle() 
	}

</script>

{#if data != null && !editable}
	<${viewName} message={data} />
{/if}

{#if editable }
	<${writeName} bind:message={data} />

	<button on:click={writeWrapper}> save </button>

  <button on:click={toggle}> cancel </button>
{/if}

{#if  writeFunc != null && !editable }
	<button on:click={toggle}> edit </button>
{/if}

<button on:click={deleteFunc}> Delete </button>

  `

  return allTemplate
}

export function parseCreateComponent(messageName: string,) {

  const writeName = `Write${messageName}`
  const allTemplate = `
<script>
	// @ts-nocheck
	// @ts-ignore

	import ${writeName} from './${writeName}.svelte';

	export let message;
  export let writeFunc;

</script>

	<${writeName} bind:message={message} />

	<button on:click={writeFunc}> save </button>

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
  let dir = "lib/firebase"
  const firebase = schema.generateFile(`${dir}/firebase.ts`);
  //firebase.print(firebaseTemplate)

  const firestoreTemplate = `
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

`

  const firestore = schema.generateFile(`${dir}/firestore.ts`);
  firestore.print(firestoreTemplate)

  const authTemplate = `
import { GoogleAuthProvider, signInWithPopup, type User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"
  
import { writable } from 'svelte/store';
  

async function authenticateRequest(user : User){
    let token = await user.getIdToken(false)

    let headers = new Headers();
    headers.set("Authorization", "Bearer " + token);
    return headers
}

// todo include all auth providers
const provider = new GoogleAuthProvider();

const currentUser = writable(auth.currentUser)

onAuthStateChanged(auth, (user) => {
    currentUser.set(user)
});

async function login() {
    await signInWithPopup(auth, provider).then((result) => {
        currentUser.set(result.user)
    }).catch((error) => {
        console.log(error)
    });
}

export { authenticateRequest, login ,currentUser};
`

  const auth = schema.generateFile(`${dir}/auth.ts`);
  auth.print(authTemplate)
}

export function genAuthComponent(schema: Schema) {

  const authTemplate = `
  
<script>
import { auth } from "./firebase/firebase";
  import { currentUser, login } from "./firebase/auth";

  async function logOut() {
     await auth.signOut()
  }

</script>

<nav>
	<a href="/">home</a> |
	{#if $currentUser !== null}
		<button  on:click={logOut}>Log out</button>
	{:else}
		<button  on:click={login}>Log in</button>
	{/if}
</nav>

  `
  let path = `lib/Auth.svelte`
  const layout = schema.generateFile(path);
  layout.print(authTemplate)
}

export function genLayoutPage(schema: Schema) {

  const layoutTemplate = `
  
  <script>

	import Auth from "$lib/Auth.svelte";

</script>

<Auth/>


<slot></slot>

  `
  let path = `routes/+layout.svelte`
  const layout = schema.generateFile(path);
  layout.print(layoutTemplate)
}

export function generateRoutes(schema: Schema, messageName: string) {

  let lowerCaseMessageName = messageName.toLowerCase()

  let dir = `routes/${lowerCaseMessageName}`
  const viewComponentName = `View${messageName}`

  const listComponentTemplate = `
  <script>
  // @ts-ignore
	import ${viewComponentName} from '$lib/${viewComponentName}.svelte';
	
	export let data;

  </script>

  <a href="/${lowerCaseMessageName}/new">add new item</a>

  {#if data != null}
  {#each data.data as item}
    <${viewComponentName} message={item.message}/>
    <a href="{item.path}">view more</a>
  {/each}
 {/if}

  `

  const listComponent = schema.generateFile(`${dir}/+page.svelte`);
  listComponent.print(listComponentTemplate)

  const listJsTemplate = `
  // @ts-nocheck

  import { error } from '@sveltejs/kit';

  import { dbList } from '$lib/firebase/firestore';
  
   
  export async function load() {
     let data = await dbList("${lowerCaseMessageName}")
     return {data : data}
  }
  `

  const listJS = schema.generateFile(`${dir}/+page.js`);
  listJS.print(listJsTemplate)

  const allComponentName = `All${messageName}`

  const slugComponentTemplate = `
  <script>
	// @ts-nocheck
	// @ts-ignore

	import ${allComponentName} from '$lib/${allComponentName}.svelte';

	import { dbSet, dbDelete } from '$lib/firebase/firestore';

	import { goto } from '$app/navigation';

	export let data;

	const writeFunc = async function writeDoc() {
		try {
			await dbSet(\`/${lowerCaseMessageName}/\${data.uid}\`, data.message);
		} catch (e) {
			console.error(e);
		} finally {
      goto(\`/${lowerCaseMessageName}/\${data.uid}\`) 
		}
	}

	async function deleteDoc() {
		try {
			await dbDelete(\`/${lowerCaseMessageName}/\${data.uid}\`);
		} catch (e) {
			console.error(e);
		} finally {
      goto("/${lowerCaseMessageName}") 
		}
	}
</script>

<${allComponentName} data={data.message} writeFunc={writeFunc} deleteFunc={deleteDoc}/>
  `

  const slugComponent = schema.generateFile(`${dir}/[slug]/+page.svelte`);
  slugComponent.print(slugComponentTemplate)

  const slugJsTemplate = `
  // @ts-nocheck

  import { error } from '@sveltejs/kit';

  import { dbReadWithID } from '$lib/firebase/firestore';
  
   
  export async function load({ params }) {
  
     let message;
     try {
        message = await dbReadWithID(\`/${lowerCaseMessageName}/\${params.slug}\`)
     } catch (e) {
        console.error(e);
     } 
  
     return message
  }
  `
  const slugJs = schema.generateFile(`${dir}/[slug]/+page.js`);
  slugJs.print(slugJsTemplate)


  const createComponentName = `Create${messageName}`

  const newComponentTemplate = `
  <script>
	// @ts-nocheck
	// @ts-ignore

	import { dbAdd } from '$lib/firebase/firestore';

	import { goto } from '$app/navigation';
	import ${createComponentName} from '$lib/${createComponentName}.svelte';

	let data = {};

	const writeFunc = async function writeDoc() {
		let uid = "" // todo change to be path
		try {
			uid = await dbAdd("${lowerCaseMessageName}", data);
		} catch (e) {
			console.error(e);
		} finally {
			goto(\`/${lowerCaseMessageName}/\${uid}\`) 
		}
	}
</script>

<${createComponentName} message={data} writeFunc={writeFunc}/>
`
  const newComponent = schema.generateFile(`${dir}/new/+page.svelte`);
  newComponent.print(newComponentTemplate)
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
