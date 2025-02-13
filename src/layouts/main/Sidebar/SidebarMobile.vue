<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import SheetDescription from '@/components/ui/sheet/SheetDescription.vue';
import SheetHeader from '@/components/ui/sheet/SheetHeader.vue';
import SheetTitle from '@/components/ui/sheet/SheetTitle.vue';
import { SideBarItem } from '@/types';
import { Package2, PanelLeft } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import SidebarCollapsibleLink from './SidebarCollapsibleLink.vue';
import SidebarLink from './SidebarLink.vue';

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

const isOpen = ref(false);

watch(
  () => route.path,
  () => {
    isOpen.value = false;
  }
);
</script>

<template>
  <Sheet v-model:open="isOpen">
    <SheetTrigger as-child>
      <Button class="sm:hidden" size="icon" variant="outline">
        <PanelLeft class="sm:h-5 sm:w-5 w-4 h-4" />
        <span class="sr-only">Toggle Menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent class="w-4/5" side="left">
      <SheetHeader>
        <SheetTitle></SheetTitle>
        <SheetDescription> </SheetDescription>
      </SheetHeader>
      <nav class="grid gap-2 sm:gap-6 text-lg font-medium">
        <a
          class="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          href="#"
        >
          <Package2 class="h-5 w-5 transition-all group-hover:scale-110" />
          <span class="sr-only">Acme Inc</span>
        </a>
        <template v-for="item in sidebarItems" :key="item.id">
          <SidebarLink v-if="!item.children" :router="item" :open="open" />
          <SidebarCollapsibleLink
            v-else
            :sidebarState="open"
            :defaultOpen="getStateCollapsibleLink(item.path)"
            :item="item"
            :sidebar-hover="onHover"
          />
        </template>
      </nav>
    </SheetContent>
  </Sheet>
</template>
