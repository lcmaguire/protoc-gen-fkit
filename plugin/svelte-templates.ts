

export function parseTemplate(html: string) {

    const getTplate = `
<script>
  import { onMount } from "svelte";

  export let message;
  // have the value be exported. then have a seperate 'service' to handle fetching data

  </script>

  {#if message != null}
  ${html}
  {/if}
  `
  return getTplate
}

export function viewTemplate(html: string) {

    const getTplate = `
<script>
  import { onMount } from "svelte";

  export let message;
  // have the value be exported. then have a seperate 'service' to handle fetching data

  </script>

  {#if message != null}
  ${html}
  {/if}
  `
  return getTplate
}

