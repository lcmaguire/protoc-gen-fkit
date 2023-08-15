
  <script>
	// @ts-nocheck
	// @ts-ignore

	import AllFook from '$lib/AllFook.svelte';

	import { dbSet, dbDelete } from '$lib/firebase/firestore';

	import { goto } from '$app/navigation';

	// todo do this on successful write ? https://kit.svelte.dev/docs/modules#$app-navigation-invalidateall 

	export let data;

	const writeFunc = async function writeDoc() {
		try {
			await dbSet(data);
		} catch (e) {
			console.error(e);
		} finally {
			goto("/") // todo determie where i would like to go
		}
	}

	async function deleteDoc() {
		try {
			await dbDelete(data.name);
		} catch (e) {
			console.error(e);
		} finally {
			console.log('We do cleanup here');
			goto("/")
		}
	}
</script>

<AllFook data={data} writeFunc={writeFunc} deleteFunc={deleteDoc}/>
  
