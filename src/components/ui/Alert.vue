<script setup>
import { cn } from '@/lib/utils'
defineProps({
  variant: { type: String, default: 'default' },
  class: { type: String, default: '' },
})
const variants = {
  default: 'bg-background text-foreground border',
  destructive: 'border-destructive/50 text-destructive bg-destructive/10',
  success: 'border-green-500/50 text-green-700 bg-green-50',
}
</script>

<template>
  <div
    :class="cn('relative w-full rounded-lg border p-4 text-sm', variants[variant], $props.class)"
    role="alert"
  >
    <slot />
  </div>
</template>
