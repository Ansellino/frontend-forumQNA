<script setup>
import { cn } from '@/lib/utils'
defineProps({
  class: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  modelValue: { type: String, default: '' },
  rows: { type: Number, default: 4 },
  disabled: { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <textarea
    :placeholder="placeholder"
    :value="modelValue"
    :rows="rows"
    :disabled="disabled"
    :class="cn(
      'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-colors',
      $props.class
    )"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
