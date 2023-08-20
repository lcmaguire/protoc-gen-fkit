
<script>
  // @ts-nocheck
  
    import ViewFully from '$lib/Fully/ViewFully.svelte';
    

  export let Fook;

</script>

{#if Fook != null}
  <h3> Fook</h3>

<p> {Fook.name} </p>

<p> {Fook.displayName} </p>

<p> {Fook.active}  </p>

<p> {Fook.count} </p>

<p> {Fook.rating} </p>

<ViewFully Fully={Fook.fully} />

{#if Fook.words != null}
{#each Fook.words as words}
<p> {words} </p>

{/each}
{/if}
{/if}


