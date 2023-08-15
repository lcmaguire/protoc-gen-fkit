
  import { error } from '@sveltejs/kit';

  import { dbList } from '$lib/firebase/firestore';
  
   
  /** @type {import('./$types').PageLoad} */
  export async function load() {
     let messages = await dbList()
     return { messages: messages}
  }
  
