
  <script>
	// @ts-nocheck
	// @ts-ignore

	import AllRestaurant from '$lib/Restaurant/AllRestaurant.svelte';

	import { dbSet, dbDelete } from '$lib/firebase/firestore';

	import { goto } from '$app/navigation';
    import CreateRestaurant from '$lib/Restaurant/CreateRestaurant.svelte';

	export let data;

	const writeFunc = async function writeDoc() {
		try {
			await dbSet(`/restaurant/${data.uid}`, data.message);
		} catch (e) {
			console.error(e);
		} finally {
      goto(`/restaurant/${data.uid}`) 
		}
	}
</script>

<CreateRestaurant Restaurant={data.message} writeFunc={writeFunc}/>
  
