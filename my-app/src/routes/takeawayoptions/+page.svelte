
  <script>
  // @ts-ignore
	import ViewTakeAwayOptions from '$lib/TakeAwayOptions/ViewTakeAwayOptions.svelte';
	
	export let data;

  </script>

  <a href="/takeawayoptions/new">add new item</a>

  {#if data != null}
  {#each data.data as item}
    <ViewTakeAwayOptions TakeAwayOptions={item.message}/>
    <a href="{item.path}">view more</a>
  {/each}
 {/if}

  
