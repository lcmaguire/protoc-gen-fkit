
  // @ts-nocheck

  import { error } from '@sveltejs/kit';

  import { dbList } from '$lib/firebase/firestore';
  
   
  export async function load() {
     let data = await dbList("fook")
     return {data : data}
  }
  
