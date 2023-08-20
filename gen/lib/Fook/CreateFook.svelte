
<script>
	// @ts-nocheck
	// @ts-ignore

	import WriteFook from '$lib/Fook/WriteFook.svelte';

	export let Fook;
  export let writeFunc;

</script>

	<WriteFook bind:Fook={Fook} />

	<button on:click={writeFunc}> save </button>

  
