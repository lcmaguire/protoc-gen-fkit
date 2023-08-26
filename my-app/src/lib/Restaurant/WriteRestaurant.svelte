<script>
  // @ts-nocheck
  import WriteTakeAwayOptions from "$lib/TakeAwayOptions/WriteTakeAwayOptions.svelte";
  export let Restaurant = {};
  if (Restaurant == undefined){ Restaurant = {}}
  function pushtagsArray() {if (Restaurant.tags == undefined) {Restaurant.tags = []};Restaurant.tags = Restaurant.tags.concat("")}
  function removetagsArray(index) {Restaurant.tags.splice(index, 1); Restaurant.tags = Restaurant.tags}
</script>

<input bind:value={Restaurant.title} >


<input type=number bind:value={Restaurant.price} min=0 >


<select bind:value={Restaurant.cleanliness}>
<option value="CLEANLINESS_UNSPECIFIED">CLEANLINESS_UNSPECIFIED</option>
<option value="CLEANLINESS_DISGUSTING">CLEANLINESS_DISGUSTING</option>
<option value="CLEANLINESS_BAD">CLEANLINESS_BAD</option>
<option value="CLEANLINESS_GOOD">CLEANLINESS_GOOD</option>
<option value="CLEANLINESS_EXCELLENT">CLEANLINESS_EXCELLENT</option>
</select>


{#if Restaurant.tags != null}
  {#each Restaurant.tags as tags, key}
    <input bind:value={tags} >
    <button on:click={() => removetagsArray(key)}> Remove </button>
  {/each}
{/if}
<button on:click={pushtagsArray}> Add </button>


<WriteTakeAwayOptions bind:TakeAwayOptions={Restaurant.takeAway} />

