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

<style scoped></style>
