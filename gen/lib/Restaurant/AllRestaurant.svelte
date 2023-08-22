
<script>
	// @ts-nocheck
	// @ts-ignore

	import ViewRestaurant from '$lib//Restaurant/ViewRestaurant.svelte';
	import WriteRestaurant from '$lib/Restaurant/WriteRestaurant.svelte';

	export let Restaurant;
  export let writeFunc;
  export let deleteFunc;

	let editable = false;

	function toggle() {
		editable = !editable;
	}

  // this will toggle from edit view to just view 
  function writeWrapper () {
		writeFunc()
		toggle() 
	}

</script>

{#if Restaurant != null && !editable}
	<ViewRestaurant Restaurant={Restaurant} />
{/if}

{#if editable }
	<WriteRestaurant bind:Restaurant={Restaurant} />

  <br>
  <br>
	<button on:click={writeWrapper}> save </button>

  <button on:click={toggle}> cancel </button>
{/if}

{#if  writeFunc != null && !editable }
	<button on:click={toggle}> edit </button>
{/if}

<button on:click={deleteFunc}> Delete </button>

  
