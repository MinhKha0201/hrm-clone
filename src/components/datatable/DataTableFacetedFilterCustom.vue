<script lang="ts" setup>
// @ts-nocheck
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Column } from '@tanstack/vue-table';
import { Check, CirclePlus } from 'lucide-vue-next';
import { computed, ref } from 'vue';

interface DataTableFacetedFilter {
  column?: Column<any, any>;
  title: string;
  options: {
    label: string;
    value: string;
    icon?: Object;
  }[];
}

const props = defineProps<DataTableFacetedFilter>();

const isSelectAll = ref(false);
const facets = computed(() => props.column?.getFacetedUniqueValues());
const selectedValues = computed(() => new Set(props.column?.getFilterValue() as string[]));

const onSelect = (event: any, option: any) => {
  const isSelected = selectedValues.value.has(option.value);
  if (isSelected) {
    selectedValues.value.delete(option.value);
  } else {
    selectedValues.value.add(option.value);
  }
  const filterValues = Array.from(selectedValues.value);
  props?.column?.setFilterValue(filterValues?.length > 0 ? filterValues : undefined);
};

const handleSelectAll = () => {
  isSelectAll.value = !isSelectAll.value;
  if (isSelectAll.value) props.column?.setFilterValue(props.options.map((item) => item.value));
  else props.column?.setFilterValue(undefined);
};

const handleClearFilter = () => {
  isSelectAll.value = false;
  props.column?.setFilterValue(undefined);
};
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button class="bg-muted-foreground/2 !ml-0" size="sm" variant="outline">
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
    <PopoverContent align="start" class="m-w-max p-0">
      <Command
        :filter-function="(list: DataTableFacetedFilter['options'], term) => list.filter(i => i.label.toLowerCase()?.includes(term)) "
      >
        <CommandInput :placeholder="title" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandSeparator />
          <CommandGroup>
            <CommandItem
              v-for="option in options"
              :key="option.value"
              :value="option"
              @select="(event) => onSelect(event, option)"
              class="text-xs sm:text-sm"
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
                v-if="facets?.get(option.value)"
                class="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs"
              >
                {{ facets.get(option.value) }}
              </span>
            </CommandItem>
          </CommandGroup>
          <template v-if="selectedValues.size > 0">
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                :value="{ label: 'Clear filters' }"
                class="justify-center text-center"
                @select="handleClearFilter"
              >
                Clear filters
              </CommandItem>
            </CommandGroup>
          </template>
          <CommandSeparator />
          <CommandGroup class="sticky bottom-0 bg-muted z-50 shadow-sm">
            <CommandItem :value="{ label: 'Select all' }" @select="handleSelectAll">
              <div
                :class="
                  cn(
                    'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                    isSelectAll ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                  )
                "
              >
                <Check />
              </div>
              Select all
              <span class="flex-1 text-end">
                {{ options.length }}
              </span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
