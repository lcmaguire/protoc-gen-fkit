
<script>
  // @ts-nocheck
  

  export let TakeAwayOptions;

</script>

{#if TakeAwayOptions != null}
  <h3> TakeAwayOptions</h3>

<p> {TakeAwayOptions.pickup}  </p>

<p> {TakeAwayOptions.phone}  </p>

<p> {TakeAwayOptions.uber}  </p>

<p> {TakeAwayOptions.doorDash}  </p>
{/if}


