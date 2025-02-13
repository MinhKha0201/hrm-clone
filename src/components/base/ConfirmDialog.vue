<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { AlertDialogContent, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { useConfirmDialogStore } from '@/stores';
import { ref, watch } from 'vue';
import { AlertDialogRoot } from 'radix-vue';
import { Check, X } from 'lucide-vue-next';

const confirmDialog = useConfirmDialogStore();
const isShow = ref(false);

watch(
  () => confirmDialog.getQuestion,
  (val) => {
    isShow.value = val !== null;
  },
  { immediate: true }
);
</script>
<template>
  <AlertDialogRoot v-model:open="isShow">
    <AlertDialogContent class="md:w-[400px]">
      <div class="flex flex-col gap-3 items-center">
        <div
          v-if="confirmDialog.getQuestion?.success"
          class="w-[48px] h-[48px] bg-green-200 text-green-600 flex justify-center items-center rounded-full"
        >
          <span class="i-material-symbols-light-check-rounded text-3xl"><Check /></span>
        </div>
        <div
          v-if="confirmDialog.getQuestion?.error"
          class="w-[48px] h-[48px] bg-red-200 text-red-500 flex justify-center items-center rounded-full"
        >
          <span class="i-material-symbols-light-error-rounded text-3xl">
            <X />
          </span>
        </div>
        <h2 class="text-lg font-medium">{{ confirmDialog.getQuestion?.title }}</h2>
        <p class="text-center text-sm text-gray-500">{{ confirmDialog.getQuestion?.question }}</p>
      </div>

      <AlertDialogFooter v-if="confirmDialog.data && !confirmDialog.data?.onlyConfirm" class="flex mt-3">
        <Button class="w-full rounded-md py-5 font-medium" variant="secondary" @click="confirmDialog.confirm(false)"
          >Cancel
        </Button>
        <Button class="w-full rounded-md py-5 font-medium" @click="confirmDialog.confirm(true)">Confirm</Button>
      </AlertDialogFooter>

      <AlertDialogFooter v-if="confirmDialog.data && confirmDialog.data?.onlyConfirm" class="mt-3">
        <Button class="w-full rounded-md py-5 font-medium" @click="confirmDialog.confirm(true)">OK</Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialogRoot>
</template>
