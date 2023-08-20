
<script>
	// @ts-nocheck
	// @ts-ignore

	import ViewFully from '$lib//Fully/ViewFully.svelte';
	import WriteFully from '$lib/Fully/WriteFully.svelte';

	export let Fully;
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

{#if Fully != null && !editable}
	<ViewFully Fully={Fully} />
{/if}

{#if editable }
	<WriteFully bind:Fully={Fully} />

  <br>
  <br>
	<button on:click={writeWrapper}> save </button>

  <button on:click={toggle}> cancel </button>
{/if}

{#if  writeFunc != null && !editable }
	<button on:click={toggle}> edit </button>
{/if}

<button on:click={deleteFunc}> Delete </button>

  
