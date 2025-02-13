<script setup lang="ts">
import { ComboboxFilterType } from '@/types';
import { Check } from 'lucide-vue-next';
import { HTMLAttributes, onMounted, ref, watch } from 'vue';
import FormControl from '../ui/form/FormControl.vue';
import FormDescription from '../ui/form/FormDescription.vue';
import FormItem from '../ui/form/FormItem.vue';
import FormLabel from '../ui/form/FormLabel.vue';
import FormMessage from '../ui/form/FormMessage.vue';
import Input from '../ui/input/Input.vue';
import { cn } from '@/lib/utils';
import { ComponentFieldBindingObject } from 'vee-validate';

interface Prop {
  label: string;
  type?: string;
  description?: string;
  message?: string;
  class?: HTMLAttributes['class'];
  listValue: ComboboxFilterType[];
  required?: boolean;
  componentField: ComponentFieldBindingObject<any>;
  errors: string[];
}

const props = defineProps<Prop>();

const emit = defineEmits<{
  (e: 'update:value', data: string): void;
}>();

const isShow = ref(false);
const list = ref<ComboboxFilterType[]>(props.listValue);

watch(
  () => props.listValue,
  (newVal) => {
    list.value = newVal;
  }
);

const handleFocus = () => {
  isShow.value = true;
};
const handleBlur = () => {
  isShow.value = false;
};

const handleSelect = (values: ComboboxFilterType) => {
  emit('update:value', values.label);
  isShow.value = false;
};

const handleInput = (value: string | number) => {
  const searchValue = value as string;
  if (searchValue !== '') {
    list.value = props.listValue.filter((item) => item.label.toLowerCase().includes(searchValue.toLowerCase().trim()));
    emit('update:value', searchValue);
    return;
  }
  list.value = props.listValue;
};
</script>

<template>
  <FormItem :class="cn('flex flex-col gap-1')">
    <FormLabel>{{ label }}<span v-if="required" class="text-red-500">*</span></FormLabel>
    <FormControl>
      <div class="relative">
        <Input
          type="text"
          class="focus-visible:ring-0 focus-visible:ring-offset-0"
          :class="[errors.length > 0 ? 'border-red-500' : '', cn(props.class)]"
          v-bind="componentField"
          @focus="handleFocus"
          @blur="handleBlur"
          autocomplete="off"
          @update:model-value="handleInput"
        />
        <div
          class="absolute top-[105%] w-full bg-white z-50 rounded-md shadow-md transition-all duration-200 ease-linear overflow-y-auto"
          :class="isShow ? 'max-h-60 border' : 'max-h-0'"
        >
          <ul v-if="list.length > 0" class="p-2">
            <li
              v-for="(item, index) in list"
              :key="index"
              @mousedown="() => handleSelect(item)"
              class="hover:bg-slate-100 p-2 rounded flex items-center text-sm"
            >
              <span class="flex-1">{{ item.label }}</span>
              <span v-if="item.value === componentField.modelValue"><Check :size="16" /></span>
            </li>
          </ul>
          <div v-else class="h-40 grid place-items-center">No result...</div>
        </div>
      </div>
    </FormControl>
    <FormDescription v-if="description"> {{ description }} </FormDescription>
    <FormMessage v-if="message" class="!mt-0" />
  </FormItem>
</template>
