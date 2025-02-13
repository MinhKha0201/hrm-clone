<script lang="ts" setup>
// @ts-nocheck
import { computed, type HTMLAttributes, ref } from 'vue';
import { Check, CirclePlus } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';
import { PopoverContentProps } from 'radix-vue';

interface MultiSelectProps {
  title: string;
  confirmDescription?: string;
  options: {
    label: string;
    value: string;
    icon?: Object;
  }[];
}

const props = withDefaults(
  defineProps<PopoverContentProps & MultiSelectProps & { class?: HTMLAttributes['class'] }>(),
  {
    align: 'start',
    sideOffset: 4,
    side: 'left',
  }
);
const emits = defineEmits(['update:data', 'confirm']);
const modelValue = ref<Array<string>>([]);
const facets = computed(() => modelValue.value);
const selectedValues = computed(() => new Set(modelValue.value as string[]));
const isAllChecked = ref(false);

const handleCheckAll = () => {
  isAllChecked.value = !isAllChecked.value;

  if (isAllChecked.value) {
    modelValue.value = props.options.map((option) => option.value);
  } else {
    modelValue.value = [];
  }
};

const onSelect = (event: any, option: any) => {
  const isSelected = selectedValues.value.has(option.value);
  if (isSelected) {
    selectedValues.value.delete(option.value);
  } else {
    selectedValues.value.add(option.value);
  }
  modelValue.value = Array.from(selectedValues.value);
  emits('update:data', modelValue.value);
};

const handleConfirm = () => {
  emits('confirm');
};
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button class="h-9 flex flex-row p-5 font-normal text-sm bg-muted-foreground/2 !ml-0" size="sm" variant="outline">
        <CirclePlus class="mr-2 h-4 w-4" />
        {{ title }}
        <template v-if="selectedValues.size > 0">
          <Separator class="mx-2 h-4" orientation="vertical" />
          <Badge class="rounded-sm px-1 font-normal lg:hidden" variant="secondary">
            {{ selectedValues.size }}
          </Badge>
          <div class="hidden space-x-1 lg:flex">
            <Badge class="rounded-sm px-1 font-normal" variant="secondary"> {{ selectedValues.size }} selected</Badge>
          </div>
        </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent :side="side" :align="align" class="m-w-max p-0">
      <Command :filter-function="(list: options, term) => list.filter(i => i.label.toLowerCase()?.includes(term)) ">
        <div class="flex flex-row space-x-1">
          <div class="flex flex-row items-center ml-3">
            <Checkbox :checked="isAllChecked" @update:checked="handleCheckAll" />
          </div>
          <div class="flex flex-row items-end">
            <CommandInput :placeholder="title" />
          </div>
        </div>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="option in options"
              :key="option.value"
              :value="option"
              @select="(event) => onSelect(event, option)"
              class="hover:bg-sky-700"
            >
              <div
                :class="
                  cn(
                    'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                    selectedValues.has(option.value)
                      ? 'bg-primary text-primary-foreground'
                      : 'opacity-50 [&_svg]:invisible'
                  )
                "
              >
                <Check />
              </div>
              <component :is="option.icon" v-if="option.icon" class="mr-2 h-4 w-4 text-muted-foreground" />
              <span class="inline-block break-all">{{ option.label }}</span>
              <span
                v-if="facets?.find((item) => item.value === option.value)"
                class="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs"
              >
                {{ facets?.find((item) => item.value === option.value) }}
              </span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
        <template v-if="selectedValues.size > 0">
          <CommandSeparator />
          <CommandGroup class="items-center space-y-1 justify-center">
            <CommandItem
              :value="{ label: 'Clear filters' }"
              class="justify-center text-center bg-secondary !hover:bg-secondary/10"
              @select="
                () => {
                  modelValue = undefined;
                  isAllChecked = false;
                }
              "
            >
              Clear filters
            </CommandItem>
            <Button class="justify-center text-sm !ml-0 w-full" v-if="confirmDescription" @click="handleConfirm">
              {{ confirmDescription }}
            </Button>
          </CommandGroup>
        </template>
      </Command>
    </PopoverContent>
  </Popover>
</template>
