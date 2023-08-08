<script>
    // Goal is to have it work with https://google.aip.dev/131
    import { onMount } from "svelte";

    export let message;
    // have the value be exported. then have a seperate 'service' to handle fetching data
</script>

{#if message != null}
    <h1>Fook</h1>
    <input bind:value={message.name} />
    <input bind:value={message.display_name} />
    <input type="checkbox" bind:checked={message.active} />
    <input type="number" bind:value={message.count} min="0" />
{/if}
