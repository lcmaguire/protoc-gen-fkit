
<script>
  // @ts-nocheck
  

  export let TakeAwayOptions;

  if (TakeAwayOptions == null) {
    TakeAwayOptions = {}
  }

</script>

{#if TakeAwayOptions != null}
  <h3> TakeAwayOptions</h3>


<input type=checkbox  bind:checked={TakeAwayOptions.pickup}>


<input type=checkbox  bind:checked={TakeAwayOptions.phone}>


<input type=checkbox  bind:checked={TakeAwayOptions.uber}>


<input type=checkbox  bind:checked={TakeAwayOptions.doorDash}>

{/if}


