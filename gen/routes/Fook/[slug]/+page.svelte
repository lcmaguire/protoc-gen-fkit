
  <script>
	// @ts-nocheck
	// @ts-ignore

	import AllFook from '$lib/AllFook.svelte';

	import { dbSet, dbDelete } from '$lib/firebase/firestore';

	import { goto } from '$app/navigation';

	export let data;

	const writeFunc = async function writeDoc() {
		try {
			await dbSet(`/fook/${data.uid}`, data.message);
		} catch (e) {
			console.error(e);
		} finally {
      goto(`/fook/${data.uid}`) 
		}
	}

	async function deleteDoc() {
		try {
			await dbDelete(`/fook/${data.uid}`);
		} catch (e) {
			console.error(e);
		} finally {
      goto("/fook") 
		}
	}
</script>

<AllFook data={data.message} writeFunc={writeFunc} deleteFunc={deleteDoc}/>
  
