
  <script>
	// @ts-nocheck
	// @ts-ignore

	import AllRestaurant from '$lib/Restaurant/AllRestaurant.svelte';

	import { dbSet, dbDelete } from '$lib/firebase/firestore';

	import { goto } from '$app/navigation';

	export let data;

	function writeFunc() {
		goto(`/restaurant/${data.uid}/update`) 
		/*try {
			await dbSet(`/restaurant/${data.uid}`, data.message);
		} catch (e) {
			console.error(e);
		} finally {
      goto(`/restaurant/${data.uid}`) 
		}*/
	}

	async function deleteDoc() {
		try {
			await dbDelete(`/restaurant/${data.uid}`);
		} catch (e) {
			console.error(e);
		} finally {
      goto("/restaurant") 
		}
	}
</script>

<AllRestaurant Restaurant={data.message} writeFunc={writeFunc} deleteFunc={deleteDoc}/>
  
