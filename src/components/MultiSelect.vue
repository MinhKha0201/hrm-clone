<script lang="ts" setup>
// @ts-nocheck
import { computed, ref } from 'vue';
import { CirclePlus, Check } from 'lucide-vue-next';
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

interface MultiSelectProps {
  title: string;
  options: {
    label: string;
    value: string;
    icon?: Object;
  }[];
}

const props = defineProps<MultiSelectProps>();
const emits = defineEmits(['update:data']);
const modelValue = ref<Array<string>>([]);
const facets = computed(() => modelValue.value);
const selectedValues = computed(() => new Set(modelValue.value as string[]));
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
            <Badge v-if="selectedValues.size > 2" class="rounded-sm px-1 font-normal" variant="secondary">
              {{ selectedValues.size }} selected
            </Badge>

            <template v-else>
              <Badge
                v-for="option in options.filter((option) => selectedValues.has(option.value))"
                :key="option.value"
                class="rounded-sm px-1 font-normal"
                variant="secondary"
              >
                {{ option.label }}
              </Badge>
            </template>
          </div>
        </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent align="start" class="w-[220px] p-0">
      <Command
        :filter-function="(list: DataTableFacetedFilter['options'], term) => list.filter(i => i.label.toLowerCase()?.includes(term)) "
      >
        <CommandInput :placeholder="title" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="option in options"
              :key="option.value"
              :value="option"
              @select="(event) => onSelect(event, option)"
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

          <template v-if="selectedValues.size > 0">
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                :value="{ label: 'Clear filters' }"
                class="justify-center text-center"
                @select="() => (modelValue = undefined)"
              >
                Clear filters
              </CommandItem>
            </CommandGroup>
          </template>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
