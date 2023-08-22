
<script>
  // @ts-nocheck
  
	  import WriteTakeAwayOptions from '$lib/TakeAwayOptions/WriteTakeAwayOptions.svelte';
    

  export let Restaurant;

  
      function pushtagsArray() {
        if (Restaurant.tags == undefined) { // if underfined initialize array
          Restaurant.tags = []
        }
        let emptyVal =  ""
        Restaurant.tags = Restaurant.tags.concat(emptyVal)
      }

      function removetagsArray(index) {
        if (Restaurant.tags == undefined) { // if underfined initialize array
          Restaurant.tags = []
        }
        Restaurant.tags.splice(index, 1) // this removes element represented by index.
        Restaurant.tags = Restaurant.tags // this causes UI to update current values
      }
      

</script>

{#if Restaurant != null}
  <h3> Restaurant</h3>


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
<button on:click={() => removetagsArray(key)}> - </button>
{/each}
{/if}
<button on:click={pushtagsArray}> + </button>


<WriteTakeAwayOptions bind:TakeAwayOptions={Restaurant.takeAway} />

{/if}


