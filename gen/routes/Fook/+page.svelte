
  <script>
  // @ts-ignore
	import ViewFook from '$lib/ViewFook.svelte';
	
	export let data;

  </script>

  <a href="/fook/new">add new item</a>

  {#if data != null}
  {#each data.data as item}
    <ViewFook message={item.message}/>
    <a href="{item.path}">view more</a>
  {/each}
 {/if}

  
