
  <script>
  // @ts-ignore
	import ViewFook from '$lib/ViewFook.svelte';
	
	export let data;

  </script>

  {#if data != null}
  {#each data.messages as item}
    <ViewFook message={item}/>
  {/each}
 {/if}

  
