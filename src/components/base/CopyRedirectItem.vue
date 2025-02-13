<script setup lang="ts">
import { Copy, ExternalLink } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

interface CopyRedirectItem {
  value?: string | null;
  hasRedirect?: boolean;
}

defineProps<CopyRedirectItem>();

const handleCopy = (value?: string | null) => {
  if (value) {
    navigator.clipboard.writeText(value);
    setTimeout(() => {
      toast.success('Copied link!');
    }, 100);
  } else {
    setTimeout(() => {
      toast.warning('No value for copy');
    }, 100);
  }
};
</script>

<template>
  <span @click="handleCopy(value)" class="px-1 hover:cursor-pointer"> <Copy :size="13" /></span>
  <a v-if="hasRedirect" :href="value || undefined" target="_blank" class="flex items-center h-10">
    <ExternalLink :size="13" />
  </a>
</template>
