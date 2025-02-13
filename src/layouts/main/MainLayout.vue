<script lang="ts" setup>
import SidebarMain from '@/layouts/main/Sidebar/SidebarMain.vue';
import { useAppStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { useTimeoutFn } from '@vueuse/core';
import { computed, ref } from 'vue';
import SidebarMobile from '@/layouts/main/Sidebar/SidebarMobile.vue';
import UserDropdownMenu from '@/layouts/main/Navbar/UserDropdownMenu.vue';
import BreadcrumbMain from '@/layouts/main/Navbar/BreadcrumbMain.vue';
import ThemeSwitch from '@/components/ThemeSwitch.vue';

const appStore = useAppStore();
const { systemSidebar, showSidebar } = storeToRefs(appStore);
const hover = ref(true);
const mouseOver = ref(false);
if (showSidebar.value) {
  hover.value = false;
}
const collapse = (state: Boolean): void => {
  if (state === false) {
    hover.value = false;
    useTimeoutFn(() => {
      hover.value = true;
    }, 50);
  }
};

const layoutMargin = computed(() => {
  if (showSidebar.value) return 'sm:ml-52';
  return 'sm:ml-16';
});
</script>

<template>
  <div class="flex min-h-screen w-full flex-col bg-muted/40">
    <!--  side bar-->
    <aside
      :class="[
        'group fixed inset-y-0 left-0 z-50 hidden transition-all duration-300 flex-col border-r bg-background sm:flex overflow-x-hidden',
        {
          'w-52': showSidebar,
          'w-16': !showSidebar,
          'hover:w-52': !showSidebar && hover,
        },
      ]"
      @mouseover="mouseOver = true"
      @mouseleave="mouseOver = false"
    >
      <sidebar-main
        :sidebar-items="systemSidebar"
        :onHover="mouseOver"
        v-model:open="showSidebar"
        @update:open="collapse"
      />
    </aside>
    <!--  header  -->
    <header
      :class="[
        'fixed inset-x-0 top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 shadow',
        layoutMargin,
      ]"
    >
      <!-- sidebar mobile  -->
      <SidebarMobile
        :sidebar-items="systemSidebar"
        :onHover="mouseOver"
        v-model:open="showSidebar"
        @update:open="collapse"
      />
      <!--  breadcrumb   -->
      <BreadcrumbMain />
      <div class="relative ml-auto flex items-center gap-x-3 sm:flex-1 sm:grow-0">
        <!--  theme setting  -->
        <ThemeSwitch />
        <!--  account setting  -->
        <UserDropdownMenu />
      </div>
    </header>

    <!--  main content  -->
    <!-- route view -->
    <main :class="['flex-1 mt-16 p-2 sm:p-4 ', layoutMargin]">
      <div class="bg-background min-h-main-layout p-3 rounded-md border">
        <router-view />
      </div>
    </main>
  </div>
</template>
