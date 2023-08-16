
<script>
	// @ts-nocheck
	// @ts-ignore

	import WriteFook from './WriteFook.svelte';

	export let message;
  export let writeFunc;

</script>

	<WriteFook bind:message={message} />

	<button on:click={writeFunc}> save </button>

  
