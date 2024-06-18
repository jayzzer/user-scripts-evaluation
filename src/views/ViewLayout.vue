<template>
  <NLayout content-style="padding: 24px;">
    <NH1>{{ title }}</NH1>
    <NLayoutContent>
      <slot />
    </NLayoutContent>
  </NLayout>
</template>

<script setup lang="ts">
import { NH1, NLayout, NLayoutContent } from 'naive-ui'

interface Props {
  title: string
}
defineProps<Props>()
</script>

<style scoped></style>
