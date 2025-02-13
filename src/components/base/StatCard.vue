<script lang="ts" setup>
import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'vue';

interface Prop {
  quantity: number;
  title: string;
  icon: any;
  class?: HTMLAttributes['class'];
}

const props = defineProps<Prop>();
</script>
<template>
  <div class="relative min-h-20 shadow rounded-md border">
    <div :class="cn('absolute left-0 top-0 h-full w-2 rounded-l-md bg-black', props.class)"></div>
    <div class="ml-4 p-2 flex items-center">
      <div class="flex-1">
        <h1 class="text-2xl">{{ quantity }}</h1>
        <p>{{ title }}</p>
      </div>
      <div :class="cn('border-2 rounded-full p-2 !bg-inherit', props.class)">
        <component :is="icon"></component>
      </div>
    </div>
  </div>
</template>
