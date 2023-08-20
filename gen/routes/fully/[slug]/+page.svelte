
  <script>
	// @ts-nocheck
	// @ts-ignore

	import AllFully from '$lib/AllFully.svelte';

	import { dbSet, dbDelete } from '$lib/firebase/firestore';

	import { goto } from '$app/navigation';

	export let data;

	const writeFunc = async function writeDoc() {
		try {
			await dbSet(`/fully/${data.uid}`, data.message);
		} catch (e) {
			console.error(e);
		} finally {
      goto(`/fully/${data.uid}`) 
		}
	}

	async function deleteDoc() {
		try {
			await dbDelete(`/fully/${data.uid}`);
		} catch (e) {
			console.error(e);
		} finally {
      goto("/fully") 
		}
	}
</script>

<AllFully Fully={data.message} writeFunc={writeFunc} deleteFunc={deleteDoc}/>
  
