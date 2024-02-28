<script setup lang="ts">
import { markPageShellEnd } from '../composables/useIsPageShell'
import { useTitle } from '../composables/useTitle'

markPageShellEnd()
const title = useTitle()
</script>

<template>
  <div class="content" :data-title="title">
    <Suspense>
      <slot />
    </Suspense>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  padding: 24px 16px 24px;
}
</style>
