<script setup lang="ts">
import type { Table } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { computed } from 'vue';
import { MeetingRoom } from '@/types/meeting-room.type';
import { X } from 'lucide-vue-next';

interface DataTableToolbarProps {
  table: Table<MeetingRoom>;
}

const props = defineProps<DataTableToolbarProps>();

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0);
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-1 items-center space-x-2">
      <Input
        placeholder="Filter room..."
        :model-value="(table.getColumn('name')?.getFilterValue() as string) ?? ''"
        class="h-auto w-[150px] lg:w-[250px]"
        @input="table.getColumn('name')?.setFilterValue($event.target.value)"
      />

      <Button v-if="isFiltered" variant="outline" class="h-auto px-2 lg:px-3" @click="table.resetColumnFilters()">
        Reset
        <X class="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
