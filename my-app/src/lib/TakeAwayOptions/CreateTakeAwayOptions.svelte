<script>
	// @ts-nocheck
	// @ts-ignore

	import WriteTakeAwayOptions from '$lib/TakeAwayOptions/WriteTakeAwayOptions.svelte';
	export let TakeAwayOptions;
  export let writeFunc;

</script>

<WriteTakeAwayOptions bind:TakeAwayOptions={TakeAwayOptions} />

<button on:click={writeFunc}> save </button>
