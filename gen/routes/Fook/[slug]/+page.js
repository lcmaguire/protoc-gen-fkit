
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
  
