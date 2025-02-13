<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { cn } from '@/lib/utils';
import { ComboboxFilterType } from '@/types';
import { Check, ChevronsUpDown } from 'lucide-vue-next';
import { HTMLAttributes, ref, watch } from 'vue';

interface Prop {
  default_value?: string;
  label: string;
  list: ComboboxFilterType[];
  message?: boolean;
  required?: boolean;
  class?: HTMLAttributes['class'];
  errors: string[];
  disabled?: boolean;
  dropdown_width?: number;
}

const props = defineProps<Prop>();
const emit = defineEmits<{
  (e: 'update:select', value: string): void;
}>();

const values = ref(props.default_value);
const isOpen = ref(false);

watch(
  () => props.default_value,
  (newValue) => {
    values.value = newValue;
  }
);

const handleSelect = (value: string) => {
  values.value = value;
  emit('update:select', values.value);
  isOpen.value = false;
};
</script>

<template>
  <FormItem :class="cn('flex flex-col gap-1', props.class)">
    <FormLabel>{{ label }}<span v-if="required" class="text-red-500">*</span></FormLabel>
    <Popover v-model:open="isOpen">
      <PopoverTrigger as-child>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            :class="
              cn(
                'justify-between disabled:opacity-1',
                !values && 'text-muted-foreground',
                errors.length > 0 && 'border-red-500'
              )
            "
            :disabled="disabled"
          >
            <span class="flex-1 text-start">
              {{ values ? list.find((item) => item.value === values)?.label : `${label}` }}
            </span>
            <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent class="p-0" :class="`w-[${dropdown_width || '200'}px]`">
        <Command>
          <CommandInput :placeholder="`Search ${label}...`" />
          <CommandEmpty>Nothing found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              <CommandItem
                v-for="item in list"
                :key="item.value"
                :value="item.label"
                @select="() => handleSelect(item.value)"
              >
                <Check :class="cn('mr-2 h-4 w-4', item.value === values ? 'opacity-100' : 'opacity-0')" />
                {{ item.label }}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    <FormMessage v-if="message" />
  </FormItem>
</template>
