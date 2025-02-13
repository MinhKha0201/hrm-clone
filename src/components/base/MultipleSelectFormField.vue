<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { cn } from '@/lib/utils';
import { ComboboxFilterType } from '@/types';
import { Check, ChevronsUpDown } from 'lucide-vue-next';
import { HTMLAttributes, onUpdated, ref, watch } from 'vue';

interface Prop {
  default_value?: string[];
  label: string;
  list: ComboboxFilterType[];
  message?: boolean;
  required?: boolean;
  class?: HTMLAttributes['class'];
  errors: string[];
  disabled?: boolean;
  reset?: boolean;
}

const props = defineProps<Prop>();
const emit = defineEmits<{
  (e: 'update:select', value: string[]): void;
}>();

const values = ref<string[]>(props.default_value || []);

onUpdated(() => {
  if (props.reset) {
    values.value = [];
    return;
  }
  values.value = props.default_value ? [...props.default_value] : [];
});

const handleSelect = (value: string) => {
  const index = values.value.findIndex((item) => item === value);
  if (index > -1) {
    values.value.splice(index, 1);
  } else {
    values.value.push(value);
  }
  emit('update:select', values.value);
};
</script>

<template>
  <FormItem :class="cn('flex flex-col gap-1', props.class)">
    <FormLabel>{{ label }}<span v-if="required" class="text-red-500">*</span></FormLabel>
    <Popover>
      <PopoverTrigger as-child>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            :class="
              cn(
                'justify-between',
                !values && 'text-muted-foreground',
                errors.length > 0 && 'border-red-500',
                props.class
              )
            "
          >
            {{ values.length > 0 ? `${values.length} ${label}(s) Selected` : `${label}` }}
            <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent class="w-[300px] p-0">
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
                <Check :class="cn('mr-2 h-4 w-4', values.includes(item.value) ? 'opacity-100' : 'opacity-0')" />
                {{ item.label }}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    <FormMessage />
  </FormItem>
</template>
