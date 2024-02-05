<script setup lang="ts">
import { markPageShellEnd } from '../composables/useIsPageShell'

markPageShellEnd()
</script>

<template>
  <div class="content">
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
  min-height: 110vh;
}
</style>
