
  // @ts-nocheck
  
  import { error } from '@sveltejs/kit';

  import { dbList } from '$lib/firebase/firestore';
  
   
  export async function load() {
     let messages = await dbList("fook")
     return { messages: messages}
  }
  
