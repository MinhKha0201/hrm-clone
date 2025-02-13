<script lang="ts" setup>
import { computed } from 'vue';
import { useColorMode } from '@vueuse/core';
import { Toaster as ToasterSonner } from '@/components/ui/sonner';
import Toaster from './components/ui/toast/Toaster.vue';
import ConfirmModal from '@/components/base/ConfirmDialog.vue';

const model = useColorMode();
const isDarkModel = computed(() => model.store.value === 'dark');
</script>

<template>
  <div :class="{ dark: isDarkModel }">
    <ConfirmModal />
    <ToasterSonner :rich-colors="true" :position="'top-right'" :expand="true" />
    <Toaster />
    <router-view />
  </div>
</template>
