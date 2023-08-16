
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
			await dbSet(data.message);
		} catch (e) {
			console.error(e);
		} finally {
      goto(`/fook/${uid}`) 
		}
	}

	async function deleteDoc() {
		try {
			await dbDelete(data.uid);
		} catch (e) {
			console.error(e);
		} finally {
			console.log('We do cleanup here');
			goto("/")
      goto("/fook") 
		}
	}
</script>

<AllFook data={data.message} writeFunc={writeFunc} deleteFunc={deleteDoc}/>
  
