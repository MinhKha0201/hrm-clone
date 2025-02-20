<script lang="ts" setup>
import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/vue-table';

import { ROWS_PER_PAGE } from '@/constants';
import { valueUpdater } from '@/lib/utils';
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
import { useModalStore, useUserStore } from '@/stores';
import UserToolbar from '../../components/user/UserToolbar.vue';
import Button from '@/components/ui/button/Button.vue';
import UserModal from '@/components/user/UserModal.vue';
import { userColumn } from '@/components/user/user.column';

const store = useUserStore();
const modalStore = useModalStore();

onMounted(() => {
  if (store.users.length === 0) store.getAllUser();
});

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});

const table = useVueTable({
  get data() {
    return store.users;
  },
  get columns() {
    return userColumn;
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
  modalStore.isOpen = true;
};
</script>
<template>
  <div>
    {{ 123 }}
    <h1 class="text-xl font-normal">List users</h1>
    <div class="my-4 flex justify-between">
      <UserToolbar :table="table" />
      <Button class="bg-green-500 hover:bg-green-500" @click="handleClick">Add user</Button>
    </div>
    <div>
      <DataTable :table="table" />
    </div>
    <UserModal :isOpen="modalStore.isOpen" />
  </div>
</template>
