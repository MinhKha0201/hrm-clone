<script lang="ts" setup>
import { CheckCheck, GalleryVerticalEnd, Plus, Users } from 'lucide-vue-next';

import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/vue-table';

import StatCard from '@/components/base/StatCard.vue';
import { bookingMeetingRoomColumn } from '@/components/dashboard/booking-meeting-room.column';
import DataTable from '@/components/datatable/DataTable.vue';
import Button from '@/components/ui/button/Button.vue';
import { ROWS_PER_PAGE } from '@/constants';
import { valueUpdater } from '@/lib/utils';
import router from '@/router';
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
import BookingMeetingRoomToolbar from '../../components/dashboard/BookingMeetingRoomToolbar.vue';

const store = useMeetingRoomStore();

onMounted(async () => {
  await store.getAllBookingMeetingRooms();
  if (store.meetingRooms.length === 0) await store.getAllMeetingRoom();
});

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});

const table = useVueTable({
  get data() {
    return store.bookingMeetingRooms;
  },
  get columns() {
    return bookingMeetingRoomColumn();
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
  router.push('/book-a-room');
};
</script>
<template>
  <div>
    <h1 class="text-xl font-normal">Dashboard</h1>
    <div class="grid grid-cols-4 gap-2 mt-4">
      <StatCard
        title="Total meeting rooms"
        :quantity="store.meetingRooms.length"
        :icon="Users"
        class="text-blue-500 bg-blue-500 border-blue-500"
      />
      <StatCard
        title="Total booking"
        :quantity="store.bookingMeetingRooms.length"
        :icon="GalleryVerticalEnd"
        class="text-lime-500 bg-lime-500 border-lime-500"
      />
      <!-- <StatCard
        title="Pending booking"
        :quantity="100000"
        :icon="Loader"
        class="text-yellow-500 bg-yellow-500 border-yellow-500"
      /> -->
      <!-- <StatCard
        title="Available"
        :quantity="5"
        :icon="CheckCheck"
        class="text-green-500 bg-green-500 border-green-500"
      /> -->
      <!-- <StatCard title="In use" :quantity="5" :icon="CalendarX" class="text-red-500 bg-red-500 border-red-500" /> -->
      <!-- <StatCard title="Maintenance" :quantity="5" :icon="Bolt" class="text-gray-300 bg-gray-300 border-gray-300" /> -->
    </div>
    <div class="mt-4 flex justify-between">
      <BookingMeetingRoomToolbar :table="table" />
      <Button @click="handleClick" class="flex gap-2"><Plus :size="16" /> Book room</Button>
    </div>
    <div class="mt-4">
      <DataTable :table="table" />
    </div>
  </div>
</template>
