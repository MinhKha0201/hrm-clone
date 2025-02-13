import { defineStore } from 'pinia';
import { computed, ref, Ref } from 'vue';
import { SideBarItem } from '@/types';
import { useLocalStorage } from '@vueuse/core';
import { systemSideBar } from './default.store';
import { Themes } from '@/constants';

export const useAppStore = defineStore('app', () => {
  /**
   *  define state
   */
  const showSidebar = useLocalStorage('sidebar', true);
  const systemSidebar: Ref<SideBarItem[]> = ref(systemSideBar);
  const theme: Ref<Themes> = useLocalStorage<Themes>('theme', Themes.LIGHT);

  /**
   *  define getter
   */
  const themeActive = computed(() => {
    return theme.value;
  });

  const listThemes = computed(() => {
    return Object.entries(Themes).map(([key, value]) => {
      return {
        key,
        value,
      };
    });
  });

  /**
   *  define action
   */
  const sidebarToggle = (): void => {
    showSidebar.value = !showSidebar.value;
  };
  const setTheme = (newTheme: Themes): void => {
    theme.value = newTheme;
  };

  return {
    // ref theme ui
    themeActive,
    setTheme,
    listThemes,

    // ref sidebar ui
    systemSidebar,
    showSidebar,
    sidebarToggle,
  };
});
