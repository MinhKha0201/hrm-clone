<script lang="ts" setup>
import ConfirmAlert from '@/components/base/ConfirmAlert.vue';
import Button from '@/components/ui/button/Button.vue';
import { Check, X } from 'lucide-vue-next';

const emit = defineEmits(['click:approve', 'click:reject']);

const handleApprove = (message: string) => {
  emit('click:approve', message);
};

const handleReject = (rejectReason: string) => {
  emit('click:reject', rejectReason);
};
</script>
<template>
  <div class="flex gap-2 items-center">
    <ConfirmAlert type="success" @click="handleApprove" :reason="true"
      ><Button class="p-2 h-fit bg-green-500 hover:bg-green-500 text-white"><Check :size="16" /></Button
    ></ConfirmAlert>

    <ConfirmAlert type="error" button_content="Reject" :reason="true" @click="handleReject"
      ><Button class="p-2 h-fit bg-red-500 hover:bg-red-500 text-white"><X :size="16" /></Button
    ></ConfirmAlert>
  </div>
</template>
