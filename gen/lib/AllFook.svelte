
<script>
	// @ts-nocheck
	// @ts-ignore

	import ViewFook from './ViewFook.svelte';
	import WriteFook from './WriteFook.svelte';

	export let data;
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

{#if data != null && !editable}
	<ViewFook message={data} />
{/if}

{#if editable }
	<WriteFook bind:message={data} />

	<button on:click={writeWrapper}> save </button>

  <button on:click={toggle}> cancel </button>
{/if}

{#if  writeFunc != null && !editable }
	<button on:click={toggle}> edit </button>
{/if}

<button on:click={deleteFunc}> Delete </button>

  
