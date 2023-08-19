
  // @ts-nocheck

  import { error } from '@sveltejs/kit';

  import { dbReadWithID } from '$lib/firebase/firestore';
  
   
  export async function load({ params }) {
  
     let message;
     try {
        message = await dbReadWithID(`/fook/${params.slug}`)
     } catch (e) {
        console.error(e);
     } 
  
     return message
  }
  
