import DataTableColumnHeader from '@/components/datatable/DataTableColumnHeader.vue';
import Badge from '@/components/ui/badge/Badge.vue';
import Button from '@/components/ui/button/Button.vue';
import { STATUS_STYLE } from '@/constants';
import router from '@/router';
import { RequestDaysOff } from '@/types';
import { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import RequestDayOffActionGroup from './RequestDayOffActionGroup.vue';
import { useRequestDaysOffStore } from '@/stores';
import { Check, X } from 'lucide-vue-next';

export const requestDaysOffColumn: ColumnDef<RequestDaysOff>[] = [
  {
    accessorKey: 'requestType',
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
    cell: ({ row }) => row.original.approver?.displayName,
  },
  {
    accessorKey: 'supervisor',
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
      const handleClick = () => {
        router.push(`/request-days-off/${row.original._id}`);
      };

      const handleCancel = async () => {
        const store = useRequestDaysOffStore();
        await store.cancelRequest(row.original._id);
      };
      return h(RequestDayOffActionGroup, {
        status: row.original.status,
        'onClick:view': handleClick,
        'onClick:cancel': handleCancel,
      });
    },
  },
];
