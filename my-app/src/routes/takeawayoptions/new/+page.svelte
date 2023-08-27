
  <script>
	// @ts-nocheck
	// @ts-ignore

	import { dbAdd } from '$lib/firebase/firestore';

	import { goto } from '$app/navigation';
	import WriteTakeAwayOptions from '$lib/TakeAwayOptions/WriteTakeAwayOptions.svelte';

	let TakeAwayOptions = {};

	const writeFunc = async function writeDoc() {
		let uid = "" // todo change to be path
		try {
			uid = await dbAdd("takeawayoptions", TakeAwayOptions);
		} catch (e) {
			console.error(e);
		} finally {
			goto(`/takeawayoptions/${uid}`) 
		}
	}
</script>

<WriteTakeAwayOptions TakeAwayOptions={TakeAwayOptions} writeFunc={writeFunc}/>

