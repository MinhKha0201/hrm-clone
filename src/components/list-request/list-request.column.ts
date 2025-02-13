import Button from '@/components/ui/button/Button.vue';
import router from '@/router';
import { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import ActionGroup from '../../components/list-request/ActionGroup.vue';
import Badge from '@/components/ui/badge/Badge.vue';
import { STATUS_STYLE } from '@/constants';
import DataTableColumnHeader from '@/components/datatable/DataTableColumnHeader.vue';
import { RequestDaysOff } from '@/types';
import { useListRequestStore } from '@/stores';
import { Check, X } from 'lucide-vue-next';

export const listRequestColumn: ColumnDef<RequestDaysOff>[] = [
  {
    accessorKey: '_id',
    header: '',
    cell: '',
  },
  {
    id: 'creator.displayName',
    accessorKey: 'creator.displayName',
    header: 'Creator',
    cell: ({ row }) => row.original.creator.displayName,
  },
  {
    id: 'requestType._id',
    accessorKey: 'requestType._id',
    header: 'Request type',
    cell: ({ row }) => row.original.requestType.name,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Created date' }),
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleString('vi-VN');
    },
  },
  {
    accessorKey: 'start_date',
    header: 'Start Date',
    cell: ({ row }) => new Date(row.original.startDate).toLocaleDateString('vi-VN'),
  },
  {
    accessorKey: 'end_date',
    header: 'End Date',
    cell: ({ row }) => new Date(row.original.endDate).toLocaleDateString('vi-VN'),
  },
  //   {
  //     accessorKey: 'receiver',
  //     header: 'Receiver',
  //     cell: ({ row }) => row.original.receiver,
  //   },
  {
    id: 'supervisor.displayName',
    accessorKey: 'supervisor.displayName',
    header: 'Supervisor',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-2' }, [
        row.original.supervisor?.displayName,
        row.original.supervisor.acceptAt !== null && h(Check, { size: 16, class: 'text-green-500' }),
        row.original.supervisor.rejectAt !== null && h(X, { size: 16, class: 'text-red-500' }),
      ]);
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return h(Badge, { class: STATUS_STYLE[row.original.status] }, () => row.original.status);
    },
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => {
      const store = useListRequestStore();

      const handleApprove = async (message: string) => {
        await store.approveRequest(row.original._id, message);
      };

      const handleReject = async (rejectReason: string) => {
        console.log(rejectReason);
        await store.rejectRequest(row.original._id, rejectReason);
      };
      if (row.original.status === 'PENDING')
        return h(ActionGroup, { 'onClick:approve': handleApprove, 'onClick:reject': handleReject });
    },
  },
  {
    accessorKey: 'view',
    header: 'View',
    cell: ({ row }) => {
      const handleClick = () => {
        router.push(`/list-request/${row.original._id}`);
      };
      return h(Button, { variant: 'link', onClick: handleClick, class: 'p-0' }, () => 'View');
    },
  },
];
