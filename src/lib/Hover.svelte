<script lang="ts">
  import { Popover } from 'sveltestrap'

  export let target: string;
  export let body: string;
</script>

<Popover trigger="hover" {target}>{body}</Popover>
