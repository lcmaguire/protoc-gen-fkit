
<script>
	// @ts-nocheck
	// @ts-ignore

	import ViewTakeAwayOptions from '$lib//TakeAwayOptions/ViewTakeAwayOptions.svelte';
	import WriteTakeAwayOptions from '$lib/TakeAwayOptions/WriteTakeAwayOptions.svelte';

	export let TakeAwayOptions;
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

{#if TakeAwayOptions != null && !editable}
	<ViewTakeAwayOptions TakeAwayOptions={TakeAwayOptions} />
{/if}

{#if editable }
	<WriteTakeAwayOptions bind:TakeAwayOptions={TakeAwayOptions} />

  <br>
  <br>
	<button on:click={writeWrapper}> save </button>

  <button on:click={toggle}> cancel </button>
{/if}

{#if  writeFunc != null && !editable }
	<button on:click={toggle}> edit </button>
{/if}

<button on:click={deleteFunc}> Delete </button>

  
