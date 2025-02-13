<script setup lang="ts">
import type { Table } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { computed, onMounted } from 'vue';
import { RequestDaysOff } from '@/types';
import { X } from 'lucide-vue-next';
import DataTableFacetedFilter from '@/components/datatable/DataTableFacetedFilter.vue';
import { STATUS } from '@/constants';
import { useRequestDaysOffStore } from '@/stores';

const requestDaysOffStore = useRequestDaysOffStore();

onMounted(async () => {
  if (requestDaysOffStore.requestType.length === 0) await requestDaysOffStore.getRequestTypes();
});

interface DataTableToolbarProps {
  table: Table<RequestDaysOff>;
}

const props = defineProps<DataTableToolbarProps>();

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0);
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-1 gap-2 items-center space-x-2">
      <Input
        placeholder="Search creator..."
        :model-value="(table.getColumn('creator.displayName')?.getFilterValue() as string) ?? ''"
        class="h-auto w-[150px] lg:w-[250px] !ml-0"
        @input="table.getColumn('creator.displayName')?.setFilterValue($event.target.value)"
      />
      <Input
        placeholder="Search supervisor..."
        :model-value="(table.getColumn('supervisor.displayName')?.getFilterValue() as string) ?? ''"
        class="h-auto w-[150px] lg:w-[250px] !ml-0"
        @input="table.getColumn('supervisor.displayName')?.setFilterValue($event.target.value)"
      />
      <DataTableFacetedFilter
        v-if="table.getColumn('status')"
        :column="table.getColumn('status')"
        title="Status"
        :options="
          Object.values(STATUS).map((item) => {
            return {
              label: item,
              value: item,
            };
          })
        "
      />
      <DataTableFacetedFilter
        v-if="table.getColumn('requestType._id')"
        :column="table.getColumn('requestType._id')"
        title="Request type"
        :options="requestDaysOffStore.requestType"
      />
      <Button v-if="isFiltered" variant="outline" class="h-auto px-2 lg:px-3" @click="table.resetColumnFilters()">
        Reset
        <X class="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
