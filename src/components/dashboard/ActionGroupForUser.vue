<script lang="ts" setup>
import ConfirmAlert from '@/components/base/ConfirmAlert.vue';
import Button from '@/components/ui/button/Button.vue';
import { X } from 'lucide-vue-next';

const emit = defineEmits(['click:edit', 'click:cancel']);

const handleCancel = () => {
  emit('click:cancel');
};
</script>
<template>
  <div class="flex gap-2">
    <ConfirmAlert :type="'error'" :button_content="'Yes'" @click="handleCancel">
      <Button class="p-2 h-auto bg-red-500 hover:bg-red-500"><X :size="16" /></Button>
    </ConfirmAlert>
  </div>
</template>
