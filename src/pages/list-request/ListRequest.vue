<script lang="ts" setup>
import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/vue-table';

import { ROWS_PER_PAGE } from '@/constants';
import { valueUpdater } from '@/lib/utils';
import { useListRequestStore } from '@/stores/list-request.store';
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
import DataTable from '@/components/datatable/DataTable.vue';
import ListRequestToolbar from '../../components/list-request/ListRequestToolbar.vue';
import { listRequestColumn } from '@/components/list-request/list-request.column';

const store = useListRequestStore();
onMounted(async () => {
  if (store.requests.length === 0) await store.getAllRequest();
});

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});

const table = useVueTable({
  get data() {
    return store.requests;
  },
  get columns() {
    return listRequestColumn;
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
</script>
<template>
  <div>
    <h1 class="text-xl font-normal">List request</h1>
    <div class="my-4">
      <ListRequestToolbar :table="table" />
    </div>
    <div>
      <DataTable :table="table" />
    </div>
  </div>
</template>
