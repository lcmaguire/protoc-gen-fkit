<script>
	// @ts-nocheck
	// @ts-ignore

	import EditTakeAwayOptions from '$lib/TakeAwayOptions/EditTakeAwayOptions.svelte';
	export let TakeAwayOptions;
  export let writeFunc;

</script>

<EditTakeAwayOptions bind:TakeAwayOptions={TakeAwayOptions} />

<button on:click={writeFunc}> save </button>
