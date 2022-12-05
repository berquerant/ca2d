<script lang="ts">
  export let lines: any[];
  export let rows: number = 10;
  export let cols: number = 120;

  import { afterUpdate } from 'svelte';

  // TODO: slow
  function formatLog(xs: any[]): string {
    let s = "";
    for (let i in xs) {
      s += JSON.stringify({
        seq: i,
        log: xs[i]
      }) + "\n";
    }
    return s;
  }

  $: content = formatLog(lines);

  const wrapperName = "log-wrapper";
  // Scroll to bottom.
  function tail(element: Element): void {
    element.scrollTop = element.scrollHeight;
  }
  // Display the last part of textareas.
  afterUpdate(() => {
    for (let wrappers of document.getElementsByClassName(wrapperName)) {
      for (let area of wrappers.children) {
        tail(area);
      }
    }
  });
</script>

<div class={wrapperName}>
  <textarea {rows} {cols} wrap="off" readonly>{content}</textarea>
</div>
