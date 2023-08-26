
<script>
  // @ts-nocheck
  
    import ViewTakeAwayOptions from '$lib/TakeAwayOptions/ViewTakeAwayOptions.svelte';
    

  export let Restaurant;

</script>

{#if Restaurant != null}
  <h3> Restaurant</h3>

<p> {Restaurant.titleJSON} </p>

<p> {Restaurant.priceJSON} </p>

<p> Restaurant.cleanlinessJSON : {Restaurant.cleanlinessJSON} </p>

{#if Restaurant.tagsJSON != null}
{#each Restaurant.tagsJSON as tagsJSON}
<p> {tagsJSON} </p>

{/each}
{/if}

<ViewTakeAwayOptions TakeAwayOptions={Restaurant.takeAwayJSON} />
{/if}


