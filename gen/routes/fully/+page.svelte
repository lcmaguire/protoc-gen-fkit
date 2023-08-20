
  <script>
  // @ts-ignore
	import ViewFully from '$lib/Fully/ViewFully.svelte';
	
	export let data;

  </script>

  <a href="/fully/new">add new item</a>

  {#if data != null}
  {#each data.data as item}
    <ViewFully Fully={item.message}/>
    <a href="{item.path}">view more</a>
  {/each}
 {/if}

  
