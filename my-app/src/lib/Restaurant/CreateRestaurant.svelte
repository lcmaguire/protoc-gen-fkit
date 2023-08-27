<script>
	// @ts-nocheck
	// @ts-ignore

	import WriteRestaurant from '$lib/Restaurant/WriteRestaurant.svelte';
	export let Restaurant;
  export let writeFunc;

</script>

<WriteRestaurant bind:Restaurant={Restaurant} />

<button on:click={writeFunc}> save </button>
