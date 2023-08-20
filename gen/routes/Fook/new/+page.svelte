
  <script>
	// @ts-nocheck
	// @ts-ignore

	import { dbAdd } from '$lib/firebase/firestore';

	import { goto } from '$app/navigation';
	import CreateFook from '$lib/Fook/CreateFook.svelte';

	let Fook = {};

	const writeFunc = async function writeDoc() {
		let uid = "" // todo change to be path
		try {
			uid = await dbAdd("fook", Fook);
		} catch (e) {
			console.error(e);
		} finally {
			goto(`/fook/${uid}`) 
		}
	}
</script>

<CreateFook Fook={Fook} writeFunc={writeFunc}/>

