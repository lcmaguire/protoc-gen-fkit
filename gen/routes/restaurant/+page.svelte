
  <script>
  // @ts-ignore
	import ViewRestaurant from '$lib/Restaurant/ViewRestaurant.svelte';
	
	export let data;

  </script>

  <a href="/restaurant/new">add new item</a>

  {#if data != null}
  {#each data.data as item}
    <ViewRestaurant Restaurant={item.message}/>
    <a href="{item.path}">view more</a>
  {/each}
 {/if}

  
