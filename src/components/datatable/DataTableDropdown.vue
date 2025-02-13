<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Column } from '@tanstack/vue-table';
import { Check, ChevronsUpDown, ChevronUp } from 'lucide-vue-next';
import { ref } from 'vue';
import CommandSeparator from '../ui/command/CommandSeparator.vue';
import Label from '../ui/label/Label.vue';

interface Prop {
  column?: Column<any, any>;
  title: string;
  options: {
    label: string;
    value: string;
    icon?: Object;
  }[];
  width?: number;
}

const props = defineProps<Prop>();

const selectedValue = ref<string[]>([]);
const open = ref(false);

const handleSelect = (value: string) => {
  const isExist = selectedValue.value.some((item) => item === value);
  if (isExist) {
    const index = selectedValue.value.findIndex((item) => item === value);
    selectedValue.value.splice(index, 1);
  } else selectedValue.value.push(value);
  props.column?.setFilterValue(selectedValue.value.length > 0 ? selectedValue.value : undefined);
};

const handleClear = () => {
  selectedValue.value = [];
  props.column?.setFilterValue(undefined);
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <Label>{{ title }}</Label>
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button variant="outline" role="combobox" :class="`justify-between w-[200px] sm:w-[${width || 200}px]`">
          {{ selectedValue.length > 0 ? `${selectedValue.length} ${title} Selected` : `All ${title}` }}
          <ChevronUp
            :class="['ml-2 h-4 w-4 shrink-0 opacity-50 transition-all duration-300', open ? 'rotate-180' : 'rotate-0']"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent :class="`p-0 w-[200px] sm:w-[${width || 200}px]`">
        <Command>
          <CommandInput class="h-9" :placeholder="`Search ${title}...`" />
          <CommandEmpty>No {{ title }} found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              <CommandItem
                v-for="option in options"
                :key="option.value"
                :value="option.value"
                @select="handleSelect(option.value)"
              >
                {{ option.label }}
                <Check
                  :class="
                    cn(
                      'ml-auto h-4 w-4',
                      selectedValue.some((item) => item === option.value) ? 'opacity-100' : 'opacity-0'
                    )
                  "
                />
              </CommandItem>
            </CommandGroup>
            <template v-if="selectedValue.length > 0">
              <CommandSeparator />
              <CommandGroup>
                <CommandItem :value="{ label: 'clear' }" @select="handleClear"> Clear </CommandItem>
              </CommandGroup>
            </template>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </div>
</template>
