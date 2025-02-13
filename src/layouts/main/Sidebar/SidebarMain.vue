<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronsRight, Settings } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { SideBarItem } from '@/types';
import SidebarLink from '@/layouts/main/Sidebar/SidebarLink.vue';
import SidebarCollapsibleLink from '@/layouts/main/Sidebar/SidebarCollapsibleLink.vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/stores';

defineProps<{
  open: boolean;
  onHover: boolean;
  sidebarItems: SideBarItem[];
}>();
const route = useRoute();
const getStateCollapsibleLink = (path: string): boolean => {
  const matched = route.fullPath.match(new RegExp(path));
  return matched ? matched.length > 0 : false;
};

const appStore = useAppStore();
</script>

<template>
  <nav class="flex flex-col items-start space-y-2 px-2">
    <a
      href="#"
      class="flex justify-between items-center px-2 h-16 w-full border-b sm:border-0 border-dashed font-bold text-blue-700 dark:text-white text-lg md:text-base"
    >
      <h1 :class="['text-3xl animate-in transition-all ease-linear delay-500', { 'hidden group-hover:block': !open }]">
        Lutech
      </h1>
      <Button
        :class="['w-8 h-8 p-0 text-muted-foreground bg-accent', { 'rotate-180 text-blue-700': open }]"
        size="icon"
        variant="ghost"
        @click="$emit('update:open', !open)"
      >
        <ChevronsRight class="" />
      </Button>
    </a>

    <template v-for="item in sidebarItems" :key="item.id">
      <SidebarLink v-if="!item.children" :router="item" :open="open" :is-show-sidebar="appStore.showSidebar" />
      <SidebarCollapsibleLink
        v-else
        :sidebarState="open"
        :defaultOpen="getStateCollapsibleLink(item.path)"
        :item="item"
        :sidebar-hover="onHover"
      />
    </template>
  </nav>

  <!--  setting-->
  <nav class="mt-auto flex flex-col items-start gap-4 px-2 sm:py-5">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <a
            href="#"
            class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
          >
            <Settings class="h-5 w-5" />
            <span class="sr-only">Settings</span>
          </a>
        </TooltipTrigger>
        <TooltipContent side="right"> Settings</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </nav>
</template>
