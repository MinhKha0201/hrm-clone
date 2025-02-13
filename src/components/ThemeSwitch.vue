<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { SunMoon, MoonStar, MonitorCog } from 'lucide-vue-next';
import { useColorMode } from '@vueuse/core';
import { computed } from 'vue';

const mode = useColorMode();
const isActiveIconMode = computed(() => {
  const activeMode = mode.state.value;
  if (activeMode === 'light') return SunMoon;
  if (activeMode === 'dark') return MoonStar;
  return MonitorCog;
});
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon">
        <component :is="isActiveIconMode" class="text-foreground" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="p-2" align="end">
      <DropdownMenuGroup>
        <DropdownMenuItem class="flex items-center justify-between gap-x-1" @click="mode = 'light'">
          Light
          <SunMoon class="w-5 h-5 inline-block" />
        </DropdownMenuItem>
        <DropdownMenuItem class="flex items-center justify-between gap-x-1" @click="mode = 'dark'">
          Dark
          <MoonStar class="w-5 h-5 inline-block" />
        </DropdownMenuItem>
        <DropdownMenuItem class="flex items-center justify-between gap-x-1" @click="mode = 'auto'">
          System
          <MonitorCog class="w-5 h-5 inline-block" />
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
