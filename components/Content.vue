<script setup lang="ts">
import { useTitle } from '../composables/useTitle'

const title = useTitle()
</script>

<template>
  <div class="content" :data-site-title="title">
    <Suspense>
      <slot />
    </Suspense>
  </div>
</template>

<style>
/* Don't scope because sometimes <div class="content"> is generated
  directly by Service Worker (e.g. error pages),
  which doesn't know the scope attributes */
.content {
  display: flex;
  flex-direction: column;
  padding: 24px 16px 24px;
}
</style>
