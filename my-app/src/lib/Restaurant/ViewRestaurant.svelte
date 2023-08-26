<script>
  // @ts-nocheck
  import ViewTakeAwayOptions from "$lib/TakeAwayOptions/ViewTakeAwayOptions.svelte";
  export let Restaurant = {};
</script>

<p> {Restaurant.title} </p>

<p> {Restaurant.price} </p>

<p> Restaurant.cleanliness : {Restaurant.cleanliness} </p>

{#if Restaurant.tags != null}
  {#each Restaurant.tags as tags}
    <p> {tags} </p>
  {/each}
{/if}

<ViewTakeAwayOptions TakeAwayOptions={Restaurant.takeAway} />

