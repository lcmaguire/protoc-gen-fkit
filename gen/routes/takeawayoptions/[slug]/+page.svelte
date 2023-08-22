
  <script>
	// @ts-nocheck
	// @ts-ignore

	import AllTakeAwayOptions from '$lib/TakeAwayOptions/AllTakeAwayOptions.svelte';

	import { dbSet, dbDelete } from '$lib/firebase/firestore';

	import { goto } from '$app/navigation';

	export let data;

	const writeFunc = async function writeDoc() {
		try {
			await dbSet(`/takeawayoptions/${data.uid}`, data.message);
		} catch (e) {
			console.error(e);
		} finally {
      goto(`/takeawayoptions/${data.uid}`) 
		}
	}

	async function deleteDoc() {
		try {
			await dbDelete(`/takeawayoptions/${data.uid}`);
		} catch (e) {
			console.error(e);
		} finally {
      goto("/takeawayoptions") 
		}
	}
</script>

<AllTakeAwayOptions TakeAwayOptions={data.message} writeFunc={writeFunc} deleteFunc={deleteDoc}/>
  
