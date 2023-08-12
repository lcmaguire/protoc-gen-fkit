
<script>
  // @ts-nocheck
  export let message;

</script>

{#if message != null}
  <h1> Fook</h1>
<input bind:value={message.name} >
<input bind:value={message.display_name} >
<input type=checkbox  bind:checked={message.active}>
<input type=number bind:value={message.count} min=0>
{/if}


