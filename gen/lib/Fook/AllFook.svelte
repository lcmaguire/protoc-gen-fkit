
<script>
	// @ts-nocheck
	// @ts-ignore

	import ViewFook from '$lib//Fook/ViewFook.svelte';
	import WriteFook from '$lib/Fook/WriteFook.svelte';

	export let Fook;
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

{#if Fook != null && !editable}
	<ViewFook Fook={Fook} />
{/if}

{#if editable }
	<WriteFook bind:Fook={Fook} />

  <br>
  <br>
	<button on:click={writeWrapper}> save </button>

  <button on:click={toggle}> cancel </button>
{/if}

{#if  writeFunc != null && !editable }
	<button on:click={toggle}> edit </button>
{/if}

<button on:click={deleteFunc}> Delete </button>

  
