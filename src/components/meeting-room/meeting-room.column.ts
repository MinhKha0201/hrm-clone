import { MeetingRoom } from '@/types/meeting-room.type';
import { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import MeetingRoomActionGroup from './MeetingRoomActionGroup.vue';
import MeetingRoomStatus from './MeetingRoomStatus.vue';
import DataTableColumnHeader from '@/components/datatable/DataTableColumnHeader.vue';

export const meetingRoomColumn: ColumnDef<MeetingRoom>[] = [
  {
    accessorKey: 'name',
    header: 'Room Name',
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => row.original.location,
  },
  {
    accessorKey: 'seating',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Seating' }),
    cell: ({ row }) => row.original.seating,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => h(MeetingRoomStatus, { status: row.original.status }),
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => {
      return h(MeetingRoomActionGroup, { meeting_room: row.original });
    },
  },
];
