<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next';
import SidebarLink from '@/layouts/main/Sidebar/SidebarLink.vue';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SideBarItem } from '@/types';
import { computed, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    sidebarState: boolean;
    sidebarHover: boolean;
    defaultOpen: boolean;
    item: SideBarItem;
  }>(),
  {
    defaultOpen: false,
  }
);
const collapsibleState = ref(props.defaultOpen);
const isOpen = computed(() => {
  if (!props.sidebarHover && !props.sidebarState) {
    return false;
  }
  return collapsibleState.value;
});
</script>

<template>
  <Collapsible :open="isOpen" @update:open="collapsibleState = $event" class="w-full">
    <CollapsibleTrigger class="w-full">
      <router-link :to="item.path" v-slot="{ isActive }" custom>
        <div
          :class="[
            'font-semibold flex justify-between items-center px-2 py-1 gap-x-1',
            { 'mb-2': isOpen },
            { 'text-primary': isActive },
            { 'hover:text-primary text-foreground': !isActive },
            {
              'bg-primary text-white rounded-md': isActive && !sidebarState && !sidebarHover,
            },
          ]"
        >
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 sm:w-6 sm:h-6 flex item items-center justify-center mr-1">
              <component v-if="item.icon" :is="item.icon" />
            </div>
            <span class="text-sm sm:text-base" :class="{ 'invisible group-hover:visible': !sidebarState }">
              {{ item.name }}
            </span>
          </div>
          <span
            class="transition-all duration-300"
            :class="{
              'invisible group-hover:visible ': !sidebarState,
              'rotate-90': isOpen,
            }"
          >
            <ChevronRight class="h-4 w-4 sm:w-6 sm:h-6" />
          </span>
        </div>
      </router-link>
    </CollapsibleTrigger>
    <CollapsibleContent class="space-y-2 px-2">
      <SidebarLink
        v-for="router in item.children"
        key="{{router.id}}"
        :parent-path="item.path"
        :router="router"
        :open="sidebarState"
      />
    </CollapsibleContent>
  </Collapsible>
</template>
