
  <script>
	// @ts-nocheck
	// @ts-ignore

	import { dbAdd } from '$lib/firebase/firestore';

	import { goto } from '$app/navigation';
	import CreateFully from '$lib/CreateFully.svelte';

	let Fully = {};

	const writeFunc = async function writeDoc() {
		let uid = "" // todo change to be path
		try {
			uid = await dbAdd("fully", Fully);
		} catch (e) {
			console.error(e);
		} finally {
			goto(`/fully/${uid}`) 
		}
	}
</script>

<CreateFully Fully={Fully} writeFunc={writeFunc}/>

