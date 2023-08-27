
  <script>
	// @ts-nocheck
	// @ts-ignore

	import { dbAdd } from '$lib/firebase/firestore';

	import { goto } from '$app/navigation';
	import WriteRestaurant from '$lib/Restaurant/WriteRestaurant.svelte';

	let Restaurant = {};

	const writeFunc = async function writeDoc() {
		let uid = "" // todo change to be path
		try {
			uid = await dbAdd("restaurant", Restaurant);
		} catch (e) {
			console.error(e);
		} finally {
			goto(`/restaurant/${uid}`) 
		}
	}
</script>

<WriteRestaurant Restaurant={Restaurant} writeFunc={writeFunc}/>

