
<script>
  // @ts-nocheck
  

  export let TakeAwayOptions;

</script>

{#if TakeAwayOptions != null}
  <h3> TakeAwayOptions</h3>

<p> {TakeAwayOptions.pickupJSON}  </p>

<p> {TakeAwayOptions.phoneJSON}  </p>

<p> {TakeAwayOptions.uberJSON}  </p>

<p> {TakeAwayOptions.doorDashJSON}  </p>
{/if}


