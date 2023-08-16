
<script>
	// @ts-nocheck
	// @ts-ignore

	import WriteFook from './WriteFook.svelte';

	export let data;
  export let writeFunc;

</script>

	<WriteFook bind:message={data} />

	<button on:click={writeFunc}> save </button>

  
