<script>
	// @ts-nocheck
	// @ts-ignore

	import EditRestaurant from '$lib/Restaurant/EditRestaurant.svelte';
	export let Restaurant;
  export let writeFunc;

</script>

<EditRestaurant bind:Restaurant={Restaurant} />

<button on:click={writeFunc}> save </button>
