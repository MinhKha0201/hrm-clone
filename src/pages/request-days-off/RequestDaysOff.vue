<script lang="ts" setup>
import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/vue-table';

import DataTable from '@/components/datatable/DataTable.vue';
import Button from '@/components/ui/button/Button.vue';
import { ROWS_PER_PAGE } from '@/constants';
import { valueUpdater } from '@/lib/utils';
import router from '@/router';
import { useRequestDaysOffStore } from '@/stores/request-days-off.store';
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table';
import { onMounted, ref } from 'vue';
import StatCard from '@/components/base/StatCard.vue';
import { CalendarCheck2, Car, CircleDashed, ReceiptText } from 'lucide-vue-next';
import { requestDaysOffColumn } from '@/components/request-days-off/request-days-off.column';

const store = useRequestDaysOffStore();
onMounted(async () => {
  if (store.requestList.length === 0) await store.getAllRequest();
  await store.getRequestOverview();
});

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});

const table = useVueTable({
  get data() {
    return store.requestList;
  },
  get columns() {
    return requestDaysOffColumn;
  },
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
  },
  initialState: {
    pagination: {
      pageIndex: 0,
      pageSize: ROWS_PER_PAGE[0],
    },
  },
  enableRowSelection: true,
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
});

const handleClick = () => {
  router.push('/request-days-off/create-new-request');
};
</script>
<template>
  <div>
    <h1 class="text-xl">Days off</h1>
    <div class="grid grid-cols-4 gap-2 mt-4">
      <StatCard
        title="Late arrival and early departure"
        :quantity="store.overview?.late_arrival_and_early_departure_count || 0"
        :icon="Car"
        class="bg-blue-500 text-blue-500 border-blue-500"
      />
      <StatCard
        title="Vacation"
        :quantity="store.overview?.vacation_count || 0"
        :icon="CalendarCheck2"
        class="text-emerald-500 bg-emerald-500 border-emerald-500"
      />
      <StatCard
        title="Pending requests"
        :quantity="store.overview?.pending_request_count || 0"
        :icon="CircleDashed"
        class="text-yellow-500 bg-yellow-500 border-yellow-500"
      />
      <StatCard
        title="Received requests"
        :quantity="store.overview?.received_request_count || 0"
        :icon="ReceiptText"
        class="text-fuchsia-500 bg-fuchsia-500 border-fuchsia-500"
      />
    </div>
    <div class="my-2 text-end">
      <Button @click="handleClick">Create new request</Button>
    </div>
    <DataTable :table="table" />
  </div>
</template>
