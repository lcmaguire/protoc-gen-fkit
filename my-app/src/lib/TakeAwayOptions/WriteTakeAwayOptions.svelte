<script>
  // @ts-nocheck
  export let TakeAwayOptions = {};
  if (TakeAwayOptions == undefined){ TakeAwayOptions = {}}
</script>

<input type=checkbox  bind:checked={TakeAwayOptions.pickup}>


<input type=checkbox  bind:checked={TakeAwayOptions.phone}>


<input type=checkbox  bind:checked={TakeAwayOptions.uber}>


<input type=checkbox  bind:checked={TakeAwayOptions.doorDash}>

