
<script>
  // @ts-nocheck
  
	  import WriteFully from '$lib/Fully/WriteFully.svelte';
    

  export let Fook;

  
      function pushwordsArray() {
        if (Fook.words == undefined) { // if underfined initialize array
          Fook.words = []
        }
        let emptyVal =  ""
        Fook.words = Fook.words.concat(emptyVal)
      }

      function removewordsArray(index) {
        if (Fook.words == undefined) { // if underfined initialize array
          Fook.words = []
        }
        Fook.words.splice(index, 1) // this removes element represented by index.
        Fook.words = Fook.words // this causes UI to update current values
      }
      

</script>

{#if Fook != null}
  <h3> Fook</h3>


<input bind:value={Fook.name} >


<input bind:value={Fook.displayName} >


<input type=checkbox  bind:checked={Fook.active}>


<input type=number bind:value={Fook.count} min=0>


<select bind:value={Fook.rating}>
<option value="RATING_UNSPECIFIED">RATING_UNSPECIFIED</option>
<option value="RATING_DISGUSTING">RATING_DISGUSTING</option>
<option value="RATING_BAD">RATING_BAD</option>
<option value="RATING_GOOD">RATING_GOOD</option>
<option value="RATING_EXCELLENT">RATING_EXCELLENT</option>
</select>


<WriteFully bind:Fully={Fook.fully} />


{#if Fook.words != null}
{#each Fook.words as words, key}
<input bind:value={words} >
<button on:click={() => removewordsArray(key)}> - </button>
{/each}
{/if}
<button on:click={pushwordsArray}> + </button>

{/if}


