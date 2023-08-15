
<script>
  // @ts-nocheck
  export let message;

</script>

{#if message != null}
  <h1> Fook</h1>
<p> {message.name} </p>
<p> {message.displayName} </p>
<p> {message.active}  </p>
<p> {message.count} </p>
{/if}


