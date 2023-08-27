
  <script>
	// @ts-nocheck
	// @ts-ignore

	import AllTakeAwayOptions from '$lib/TakeAwayOptions/AllTakeAwayOptions.svelte';

	import { dbSet, dbDelete } from '$lib/firebase/firestore';

	import { goto } from '$app/navigation';

	export let data;

  // todo set editable / writeFunc based upon if user is permitted to write / edit.

	function writeFunc() {
    goto(`/takeawayoptions/${data.uid}/update`)
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
  
