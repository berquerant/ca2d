<script lang="ts">
  import {
    Col,
    Container,
    Row,
    Button,
    Input,
  } from 'sveltestrap'
  import { type States, newStates, intoString, newRandomStates, fromString } from "./States"
  import { nextStates } from "./Board"
  import Field from './Field.svelte'
  import ReadOnlyModal from './ReadOnlyModal.svelte'
  import InputModal from './InputModal.svelte'
  import Hover from './Hover.svelte'
  import { createEventDispatcher } from "svelte"

  // default values
  const defaultFieldSize = 50;
  const defaultCellSize = 10;
  const defaultPlaying = false;
  const defaultUpdateIntervalMS = 150;
  const defaultGeneration = 0;
  // states
  let fieldSize = defaultFieldSize;
  let cellSize = defaultCellSize;
  let playing = defaultPlaying;
  let updateIntervalMS = defaultUpdateIntervalMS;
  let generation = defaultGeneration;

  const dispatch = createEventDispatcher();
  $: squareSize = `${cellSize}px`;
  $: data = newStates(fieldSize);

  function dispatchOperationEvent(operation: string): void {
    dispatch("operation", {
      op: operation,
    });
  }

  function reset(): void {
    fieldSize = defaultFieldSize;
    cellSize = defaultCellSize;
    playing = defaultPlaying;
    updateIntervalMS = defaultUpdateIntervalMS;
    generation = defaultGeneration;
    data = newStates(fieldSize);
    dispatchOperationEvent("reset");
  }
  // Fire the error event.
  // Format is:
  // {
  //   err: Error,
  // }
  function dispatchError(err: Error): void {
    dispatch("err", {
      err: err,
    });
  }
  // Fire the field's update event.
  // Format is:
  // {
  //   size: number,
  //   field: string,
  //   live: number,
  //   dead: number,
  //   generation: number,
  // }
  function dispatchFieldUpdatedEvent(states: States): void {
    const msg = intoString(states);
    const livings = (msg.match(/1/g) || []).length;
    dispatch("fieldUpdated", {
      size: Math.sqrt(msg.length),
      field: msg,
      live: livings,
      dead: msg.length - livings,
      generation: generation,
    });
  }
  function loadStates(str: string): void {
    try {
      const d = JSON.parse(str);
      data = fromString(d.string);
      fieldSize = data.length;
      dispatchOperationEvent("import");
    } catch(e: unknown) {
      dispatchOperationEvent("import failure");
      if (e instanceof Error) {
        dispatchError(e);
      } else {
        console.log(e);
      }
    }
  }
  function serializeStates(): string {
    dispatchOperationEvent("export");
    const str = intoString(data);
    return JSON.stringify({
      "string": str,
      "fieldSize": Math.sqrt(str.length),
    });
  }
  function onResetButtonClicked(): void {
    reset();
  }
  // Prepend auto update.
  function stop(): void {
    dispatchOperationEvent("stop");
    playing = false;
  }
  function onCellClicked(e: CustomEvent<{row: number, column: number, state: boolean}>): void {
    data[e.detail.row][e.detail.column] = !e.detail.state; // reverse state
    data = data;
    stop();
  }
  // Calculate the next states.
  function update(): void {
    generation++;
    data = nextStates(data);
    dispatchFieldUpdatedEvent(data);
  }
  function onNextButtonClicked(): void {
    update();
    stop();
  }
  function onRandomButtonClicked(): void {
    dispatchOperationEvent("random");
    data = newRandomStates(fieldSize);
    stop();
  }
  function play(): void {
    if (!playing) return; // disable auto update
    update();
    setTimeout(() => play(), updateIntervalMS);
  }
  function onPlayButtonClicked(): void {
    dispatchOperationEvent("play");
    playing = true; // enable auto update
    play(); // start update
  }
  function onStopButtonClicked(): void {
    stop();
  }

  // For hovers
  const resetButtonID = "reset-button";
  const resetButtonDesc = "Reset field size, cell size, update interval, generation and field.";
  const randomButtonID = "random-button";
  const randomButtonDesc = "Randomize field.";
  const nextButtonID = "next-button";
  const nextButtonDesc = "Proceed 1 generation.";
  const playButtonID = "play-button";
  const playButtonDesc = "Proceed generations automatically, proceed every `Update Interval`.";
  const stopButtonID = "stop-button";
  const stopButtonDesc = "Stop generation change.";
  const exportButtonID = "export-button";
  const exportButtonDesc = "Export field as a json.";
  const importButtonID = "import-button";
  const importButtonDesc = "Import field from a json.";
</script>

<Container fluid>
  <Row>
    <Col><label for="field_size">Field Size</label></Col>
    <Col><Input name="field_size" id="field_size" type="range" bind:value={fieldSize} min="10" max="200"/></Col>
    <Col><span>{fieldSize} cell x {fieldSize} cell</span></Col>
  </Row>
  <Row>
    <Col><label for="cell_size">Cell Size</label></Col>
    <Col><Input name="cell_size" id="cell_size" type="range" bind:value={cellSize} min="1" max="40"/></Col>
    <Col><span>{cellSize} px</span></Col>
  </Row>
  <Row>
    <Col><label for="update_interval_ms">Update Interval</label></Col>
    <Col><Input name="update_interval_ms" id="update_interval_ms" type="range" bind:value={updateIntervalMS} min="1" max="1000"/></Col>
    <Col><span>{updateIntervalMS} ms</span></Col>
  </Row>
  <Row>
    <Col xs=5>
      <Row>
        <Col>
          <Button id={resetButtonID} color="danger" on:click={onResetButtonClicked}>Reset</Button>
          <Hover target={resetButtonID} body={resetButtonDesc}/>
        </Col>
        <Col>
          <Button id={randomButtonID} color="primary" on:click={onRandomButtonClicked}>Random</Button>
          <Hover target={randomButtonID} body={randomButtonDesc}/>
        </Col>
        <Col>
          <Button id={nextButtonID} color="primary" on:click={onNextButtonClicked}>Next</Button>
          <Hover target={nextButtonID} body={nextButtonDesc}/>
        </Col>
        <Col>
          {#if playing}
            <Button id={stopButtonID} on:click={onStopButtonClicked}>Stop</Button>
            <Hover target={stopButtonID} body={stopButtonDesc}/>
          {:else}
            <Button id={playButtonID} color="primary" on:click={onPlayButtonClicked}>Play</Button>
            <Hover target={playButtonID} body={playButtonDesc}/>
          {/if}
        </Col>
      </Row>
    </Col>
    <Col xs=3>
      <Row>
        <Col>
          <ReadOnlyModal id={exportButtonID} triggerTitle="Export" title="Export" body={serializeStates}/>
          <Hover target={exportButtonID} body={exportButtonDesc}/>
        </Col>
        <Col>
          <InputModal id={importButtonID} triggerTitle="Import" title="Import" onOK={loadStates}/>
          <Hover target={importButtonID} body={importButtonDesc}/>
        </Col>
      </Row>
    </Col>
    <Col>
      <Row>
        <Col><h3>Generation</h3></Col>
        <Col><h3>{generation}</h3></Col>
      </Row>
    </Col>
  </Row>
  <Row>
    <!-- TODO: align center -->
    <Col><Field {data} on:cellClicked={onCellClicked} {squareSize}/></Col>
  </Row>
</Container>
