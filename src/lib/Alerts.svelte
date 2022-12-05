<script lang="ts">
  import { Alert } from 'sveltestrap'

  export let errors: Error[] = [];
</script>

<div>
  {#each errors as err}
    <Alert color="danger" fade={false} dismissible>{err}</Alert>
  {/each}
</div>
