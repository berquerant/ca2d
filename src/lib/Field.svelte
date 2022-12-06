<script lang="ts">
  export let data: boolean[][];
  export let clickable: boolean = true;
  export let squareSize: string = "50px";

  const fieldWrapper: string = "field-wrapper";
  import { createEventDispatcher, afterUpdate } from "svelte";
  afterUpdate(() => {
    // Change go board size.
    for (const wrapper of document.getElementsByClassName(fieldWrapper)) {
      const w = wrapper as HTMLDivElement;
      const style = w.style;
      style.setProperty("grid-template-rows", `repeat(${data.length}, ${squareSize})`);
      style.setProperty("grid-template-columns", `repeat(${data[0].length}, ${squareSize})`);
    }
  });
  const dispatch = createEventDispatcher();
  // Fire the cell's click event.
  // Format is:
  // {
  //   row: number,
  //   column: number,
  //   state: boolean,
  // }
  function onCellClicked(row: number, column: number, state: boolean): () => void {
    if (!clickable) return;
    return () =>
      dispatch("cellClicked", {
        row: row,
        column: column,
        state: state,
      });
  }
</script>

<div class={fieldWrapper}>
  {#each data as row, i}
    {#each row as column, j}
      {#if column}
        <div class="field-cell field-true" on:click={onCellClicked(i, j, true)}> </div>
      {:else}
        <div class="field-cell field-false" on:click={onCellClicked(i, j, false)}> </div>
      {/if}
    {/each}
  {/each}
</div>

<style>
  .field-wrapper {
    display: grid;
  }
  .field-true {
    background-color: green;
  }
  .field-false {
    background-color: black;
  }
</style>
