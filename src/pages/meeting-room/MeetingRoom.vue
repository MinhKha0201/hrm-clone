<script lang="ts" setup>
import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/vue-table';
import DataTable from '@/components/datatable/DataTable.vue';
import { ROWS_PER_PAGE } from '@/constants';
import { valueUpdater } from '@/lib/utils';
import { useMeetingRoomStore } from '@/stores/meeting-room.store';
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
import Button from '@/components/ui/button/Button.vue';
import MeetingRoomToolbar from '../../components/meeting-room/MeetingRoomToolbar.vue';
import { useModalStore } from '@/stores';
import MeetingRoomModal from '@/components/meeting-room/MeetingRoomModal.vue';
import { meetingRoomColumn } from '@/components/meeting-room/meeting-room.column';

const store = useMeetingRoomStore();
const modalStore = useModalStore();

onMounted(async () => {
  if (store.meetingRooms.length === 0) await store.getAllMeetingRoom();
});

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});

const table = useVueTable({
  get data() {
    return store.meetingRooms;
  },
  get columns() {
    return meetingRoomColumn;
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
    <h1 class="text-xl font-normal">Meeting Room</h1>
    <div class="mt-4 flex justify-between">
      <MeetingRoomToolbar :table="table" />
      <Button @click="handleClick">Add Room</Button>
    </div>
    <div class="mt-4">
      <DataTable :table="table" />
    </div>
    <MeetingRoomModal />
  </div>
</template>
