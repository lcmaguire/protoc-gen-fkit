
  
  <script>
	// @ts-nocheck
	// @ts-ignore

	import { dbAdd } from '$lib/firebase/firestore';

	import { goto } from '$app/navigation';
	import CreateFook from '$lib/CreateFook.svelte';

	let data = {};

	const writeFunc = async function writeDoc() {
		let uid = ""
		try {
			uid = await dbAdd(data);
		} catch (e) {
			console.error(e);
		} finally {
			goto(`/fook/${uid}`) 
		}
	}
</script>

<CreateFook message={data} writeFunc={writeFunc}/>
  

