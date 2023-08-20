
<script>
	// @ts-nocheck
	// @ts-ignore

	import WriteFully from './WriteFully.svelte';

	export let message;
  export let writeFunc;

</script>

	<WriteFully bind:message={message} />

	<button on:click={writeFunc}> save </button>

  
