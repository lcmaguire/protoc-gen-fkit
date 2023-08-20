
<script>
	// @ts-nocheck
	// @ts-ignore

	import WriteFully from '$lib/Fully/WriteFully.svelte';

	export let Fully;
  export let writeFunc;

</script>

	<WriteFully bind:Fully={Fully} />

	<button on:click={writeFunc}> save </button>

  
