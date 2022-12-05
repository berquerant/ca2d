<script lang="ts">
  import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
    Input,
  } from 'sveltestrap'

  export let id: string;
  export let triggerTitle: string = "Open";
  export let title: string = "Title";
  export let onOK: (v: string) => void;

  let body: string;
  function handleOK(): void {
    toggle();
    onOK(body);
  }

  let open = false;
  const toggle = () => {
    open = !open;
  };
</script>

<div>
  <Button {id} color="success" on:click={toggle}>{triggerTitle}</Button>
  <Modal isOpen={open} {toggle}>
    <ModalHeader {toggle}>{title}</ModalHeader>
    <ModalBody>
      <Input type="text" bind:value={body}/>
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={handleOK}>OK</Button>
    </ModalFooter>
  </Modal>
</div>
