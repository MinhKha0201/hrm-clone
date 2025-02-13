<script setup lang="ts">
import { Button } from '@/components/ui/button';
import type { Table } from '@tanstack/vue-table';

import { Input } from '@/components/ui/input';
import { X } from 'lucide-vue-next';
import { computed } from 'vue';
import { BookingMeetingRoom } from '@/types/meeting-room.type';

interface DataTableToolbarProps {
  table: Table<BookingMeetingRoom>;
}
const props = defineProps<DataTableToolbarProps>();

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0);
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-1 gap-2 items-center space-x-2">
      <Input
        placeholder="Search room..."
        :model-value="(table.getColumn('room.name')?.getFilterValue() as string) ?? ''"
        class="h-auto w-[150px] lg:w-[250px] !ml-0"
        @input="table.getColumn('room.name')?.setFilterValue($event.target.value)"
      />
      <Button v-if="isFiltered" variant="outline" class="h-auto px-2 lg:px-3" @click="table.resetColumnFilters()">
        Reset
        <X class="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
