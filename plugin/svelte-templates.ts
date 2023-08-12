

export function parseTemplate(html: string) {

    const getTplate = `
<script>
  // @ts-nocheck
  export let message;

</script>

{#if message != null}
  ${html}
{/if}

`
  return getTplate
}

export function page() {

}

