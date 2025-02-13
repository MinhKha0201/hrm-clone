import { getLocalTimeFromISOString } from '@/helper';
import router from '@/router';
import { useAuthStore } from '@/stores';
import { BookingMeetingRoom } from '@/types/meeting-room.type';
import { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import ActionGroup from '../list-request/ActionGroup.vue';
import ActionGroupForUser from './ActionGroupForUser.vue';
import { useMeetingRoomStore } from '@/stores/meeting-room.store';

export const bookingMeetingRoomColumn = (): ColumnDef<BookingMeetingRoom>[] => {
  const authStore = useAuthStore();

  return [
    {
      id: 'room.name',
      accessorKey: 'room.name',
      header: 'Room Name',
      cell: ({ row }) => row.original.room.name,
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => new Date(row.original.startDate).toLocaleDateString('vi-VN'),
    },
    {
      accessorKey: 'endDate',
      header: 'End Date',
      cell: ({ row }) => new Date(row.original.endDate).toLocaleDateString('vi-VN'),
    },
    {
      accessorKey: 'start_time',
      header: 'Start Time',
      cell: ({ row }) => getLocalTimeFromISOString(row.original.startDate),
    },
    {
      accessorKey: 'end_time',
      header: 'End Time',
      cell: ({ row }) => getLocalTimeFromISOString(row.original.endDate),
    },
    {
      accessorKey: 'createdAt',
      header: 'Booking Date',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString('vi-VN'),
    },
    {
      accessorKey: 'member',
      header: 'Member',
      cell: ({ row }) => row.original.attendees.length,
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => row.original.room.location,
    },
    {
      accessorKey: 'meeting_agenda',
      header: 'Meeting Agenda',
      cell: ({ row }) => row.original.meetingAgenda,
    },
    {
      accessorKey: 'requestBy',
      header: 'Request by',
      cell: ({ row }) => row.original.requestBy.displayName,
    },
    // {
    //   accessorKey: 'action',
    //   header: 'Action',
    //   cell: ({ row }) => {
    //     const store = useMeetingRoomStore();
    //     if (authStore.isAdmin) {
    //       return h(ActionGroup);
    //     }

    //     const handleCancel = async () => {
    //       await store.cancelBooking(row.original._id);
    //     };
    //     if (authStore.account?._id === row.original.requestBy._id)
    //       return h(ActionGroupForUser, {
    //         'onClick:cancel': handleCancel,
    //       });
    //     return null;
    //   },
    // },
  ];
};
