
  <script>
	// @ts-nocheck
	// @ts-ignore

	import { dbSet } from '$lib/firebase/firestore';

	import { goto } from '$app/navigation';
	import WriteRestaurant from '$lib/Restaurant/WriteRestaurant.svelte';

	export let data;

	async function writeFunc() {
		try {
			await dbSet(`${data.path}`, data.message);
		} catch (e) {
			console.error(e);
		} finally {
			goto(`/${data.path}`) 
		}
	}
</script>

<WriteRestaurant Restaurant={data.message} writeFunc={writeFunc}/>

