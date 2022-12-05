<script lang="ts">
  import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
  } from 'sveltestrap'

  export let id: string;
  export let triggerTitle: string = "Open";
  export let title: string = "Title";
  export let body: () => string;

  $: bodyString = "";
  let open = false;
  const toggle = () => {
    bodyString = body();
    open = !open;
  };
</script>

<div>
  <Button {id} color="success" on:click={toggle}>{triggerTitle}</Button>
  <Modal isOpen={open} {toggle}>
    <ModalHeader {toggle}>{title}</ModalHeader>
    <ModalBody>
      <textarea cols="53" rows="10" wrap="soft" readonly>{bodyString}</textarea>
    </ModalBody>
  </Modal>
</div>
