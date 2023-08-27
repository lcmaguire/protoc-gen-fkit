
  <script>
	// @ts-nocheck
	// @ts-ignore

	import { dbSet } from '$lib/firebase/firestore';

	import { goto } from '$app/navigation';
	import CreateTakeAwayOptions from '$lib/TakeAwayOptions/CreateTakeAwayOptions.svelte';

	export let data;

	async function writeFunc() {
		try {
			await dbSet(`${data.path}`, data.message);
		} catch (e) {
			console.error(e);
		} finally {
			goto(`${data.path}`) 
		}
	}
</script>

<CreateTakeAwayOptions TakeAwayOptions={data.message} writeFunc={writeFunc}/>

