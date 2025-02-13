import DataTableColumnHeader from '@/components/datatable/DataTableColumnHeader.vue';
import Badge from '@/components/ui/badge/Badge.vue';
import { STATUS_STYLE } from '@/constants';
import { RequestDaysOff } from '@/types';
import { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import ActionGroup from '../../components/list-request/ActionGroup.vue';
import Button from '@/components/ui/button/Button.vue';
import router from '@/router';
import { useRequestDaysOffStore } from '@/stores';

export const receivedRequestColumn: ColumnDef<RequestDaysOff>[] = [
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
    accessorKey: 'approver',
    header: 'Approver',
    cell: ({ row }) => row.original.approver.displayName,
  },
  {
    id: 'supervisor.displayName',
    accessorKey: 'supervisor.displayName',
    header: 'Supervisor',
    cell: ({ row }) => row.original.supervisor.displayName,
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
      const store = useRequestDaysOffStore();
      const handleApprove = async (message: string) => {
        await store.approveRequest(row.original._id, message);
      };

      const handleReject = async (rejectReason: string) => {
        await store.rejectRequest(row.original._id, rejectReason);
      };

      if (
        row.original.status === 'PENDING' &&
        row.original.supervisor.acceptAt === null &&
        row.original.supervisor.rejectAt === null
      )
        return h(ActionGroup, { 'onClick:approve': handleApprove, 'onClick:reject': handleReject });
    },
  },
  {
    accessorKey: 'view',
    header: 'View',
    cell: ({ row }) => {
      const handleClick = () => {
        router.push(`/received-requests/${row.original._id}`);
      };
      return h(Button, { variant: 'link', onClick: handleClick, class: 'p-0' }, () => 'View');
    },
  },
];
