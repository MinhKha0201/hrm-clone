<script lang="ts" setup>
import { Dot } from 'lucide-vue-next';
interface Prop {
  status: string;
}
defineProps<Prop>();
</script>
<template>
  <div class="flex items-center gap-1">
    <span
      :class="[
        status === 'ACTIVE' && 'text-green-500',
        status === 'MAINTENANCE' && 'text-gray-400',
        status === 'INACTIVE' && 'text-red-500',
      ]"
    >
      <Dot :size="48" />
    </span>
    <span class="text-sm font-medium">
      {{ status }}
    </span>
  </div>
</template>
