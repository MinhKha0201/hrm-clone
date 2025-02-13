<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ALERT_BUTTON, ALERT_STYLE } from '@/constants';
import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-vue-next';
import { ref } from 'vue';
import Label from '../ui/label/Label.vue';
import Textarea from '../ui/textarea/Textarea.vue';

interface Prop {
  type: 'success' | 'warning' | 'error' | 'info';
  button_content?: string;
  reason?: boolean;
}

const props = defineProps<Prop>();

const modelValue = ref('');
const isOpen = ref(false);

const emit = defineEmits(['click']);

const handleClick = () => {
  if (props.type === 'error' && props.reason && modelValue.value === '') {
    isOpen.value = true;
    return;
  }
  emit('click', modelValue.value);
  isOpen.value = false;
  modelValue.value = '';
};

const handleCancel = () => {
  modelValue.value = '';
  isOpen.value = false;
};

const handleInput = (payload: string | number) => {
  modelValue.value = payload as string;
};

const handleOpen = (open: boolean) => {
  if (open) {
    isOpen.value = open;
  }
};
</script>

<template>
  <AlertDialog @update:open="handleOpen" :open="isOpen">
    <AlertDialogTrigger as-child>
      <slot />
    </AlertDialogTrigger>
    <AlertDialogContent class="w-[400px]">
      <AlertDialogHeader>
        <AlertDialogTitle class="text-center">Do you want to accept?</AlertDialogTitle>
        <AlertDialogDescription> </AlertDialogDescription>
      </AlertDialogHeader>
      <div class="flex justify-center">
        <div class="grid place-items-center w-40 h-40 rounded-md text-white" :class="ALERT_STYLE[type]">
          <TriangleAlert v-if="type === 'warning'" :size="150" />
          <Info v-if="type === 'info'" :size="150" />
          <CircleX v-if="type === 'error'" :size="150" />
          <CircleCheck v-if="type === 'success'" :size="150" />
        </div>
      </div>
      <div class="flex items-center gap-2" v-if="reason">
        <Label>Message</Label>
        <Textarea @update:model-value="handleInput" class="focus-visible:ring-0 focus-visible:ring-offset-0" />
      </div>
      <AlertDialogFooter class="sm:justify-center">
        <AlertDialogCancel class="w-[100px]" @click="handleCancel">Cancel</AlertDialogCancel>
        <AlertDialogAction
          class="w-[100px]"
          :class="`${ALERT_STYLE[type]} hover:${ALERT_STYLE[type]}`"
          @click="handleClick"
          >{{ button_content || ALERT_BUTTON[type] }}</AlertDialogAction
        >
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
