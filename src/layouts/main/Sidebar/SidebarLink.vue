<script setup lang="ts">
import { SideBarItem } from '@/types';
import { ChevronRight } from 'lucide-vue-next';

const props = defineProps<{
  parentPath?: string;
  router: SideBarItem;
  open: boolean;
  isShowSidebar?: boolean;
}>();

const generatePath = (path: string): string => {
  if (props.parentPath) {
    path = props.parentPath + path;
  }
  return path;
};
</script>

<template>
  <router-link :to="generatePath(router.path)" v-slot="{ href, navigate, isExactActive }" custom>
    <a
      :href="href"
      :class="[
        'w-full px-2 py-1 flex items-center gap-x-2 transition-colors text-base ',
        { 'bg-primary text-white rounded-md': isExactActive },
        { 'hover:text-primary text-foreground': !isExactActive },
      ]"
      @click="navigate"
    >
      <span class="w-4 h-4 sm:w-6 sm:h-6 flex item items-center justify-center">
        <component :is="router.icon || ChevronRight" />
      </span>
      <span
        :class="[
          'group-hover:block transition-opacity ease-linear delay-200 font-semibold whitespace-nowrap text-sm sm:text-base',
          { hidden: !open, block: open },
        ]"
      >
        {{ router.name }}
      </span>
    </a>
  </router-link>
</template>

<style scoped></style>
