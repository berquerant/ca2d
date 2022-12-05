<script lang="ts">
  import { Col, Container, Row, Input } from 'sveltestrap'
  import Game from './lib/Game.svelte'
  import Log from './lib/Log.svelte'
  import Alerts from './lib/Alerts.svelte'
  import Hover from './lib/Hover.svelte'

  let lines: any[] = [
    "Welcome to ca2d!",
    "You can switch a cell's on/off to click the field.",
  ];
  let enableLog: boolean = false;
  let errors: Error[] = [];

  function writeLog(x: any): void {
    lines.push(x);
    lines = lines;
  }

  function onFieldUpdated(e: CustomEvent<{field: string, size: number, live: number, dead: number, turn: number}>): void {
    if (!enableLog) return;
    writeLog(e.detail);
  }
  function onOperation(e: CustomEvent<{op: string}>): void {
    writeLog(e.detail);
  }
  function onError(e: CustomEvent<{err: Error}>): void {
    errors.push(e.detail.err);
    errors = errors;
  }

  const loggingLabelID = "logging-label";
  const loggingLabelDesc = "Enable logs of field update.";
</script>

<main>
  <Container fluid>
    <Row>
      <Col><h1>ca2d</h1></Col>
    </Row>
    <Row>
      <Col><Alerts {errors}/></Col>
    </Row>
    <Row>
      <Col><Game on:fieldUpdated={onFieldUpdated} on:operation={onOperation} on:err={onError}/></Col>
    </Row>
    <Row>
      <Col>
        <Row>
          <Col>
            <label id={loggingLabelID} for="enable_log">Logging</label>
            <Hover target={loggingLabelID} body={loggingLabelDesc}/>
         </Col>
          <Col><Input name="enable_log" id="enable_log" type="checkbox" bind:checked={enableLog}/></Col>
        </Row>
      </Col>
      <Col></Col>
    </Row>
    <Row>
      <Col><Log {lines}/></Col>
    </Row>
  </Container>
</main>

<style>
  @import "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css";
</style>
