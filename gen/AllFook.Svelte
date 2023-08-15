
<script>
	// @ts-nocheck
	// @ts-ignore

	import ViewFook from './ViewFook.svelte';
	import WriteFook from './WriteFook.svelte';

	// todo do this on successful write ? https://kit.svelte.dev/docs/modules#$app-navigation-invalidateall 

	export let data;
  export let writeFunc;
  export let deleteFunc;

	let editable = false;

	function toggle() {
		editable = !editable;
	}

</script>

{#if data != null && !editable}
	<ViewFook message={data} />
{/if}

{#if editable }
	<WriteFook bind:message={data} />

	<button on:click={writeFunc}> save </button>
{/if}

{#if  writeFunc != null }
	<button on:click={toggle}> edit </button>
{/if}

<button on:click={deleteFunc}> Delete </button>

  
