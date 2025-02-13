import DataTableColumnHeader from '@/components/datatable/DataTableColumnHeader.vue';
import { User } from '@/types';
import { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import UserActionGroup from './UserActionGroup.vue';

export const userColumn: ColumnDef<User>[] = [
  {
    accessorKey: 'displayName',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Name' }),
    cell: ({ row }) => {
      return h('div', { class: 'w-fit' }, row.getValue('displayName'));
    },
  },
  {
    accessorKey: 'gender',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Gender' }),
    cell: ({ row }) => {
      return h('div', { class: 'w-fit' }, row.original.gender !== 0 ? 'Female' : 'Male');
    },
  },
  {
    id: 'role.name',
    accessorKey: 'role.name',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Role' }),
    cell: ({ row }) => {
      return h('div', { class: 'w-fit' }, row.original.role.name);
    },
  },
  {
    accessorKey: 'email',
    header: () => h('div', 'Email'),
    cell: ({ row }) => h('div', row.getValue<string>('email')),
  },
  {
    id: 'department',
    accessorKey: 'department',
    header: () => h('div', 'Department'),
    cell: ({ row }) => h('div', row.original.department?.name || ''),
    filterFn: (row, id, value) => {
      const _id = row.original.department?._id;
      if (!id) return false;
      return value.includes(_id);
    },
  },
  {
    accessorKey: 'action',
    header: () => 'Action',
    cell: ({ row }) => {
      return h(UserActionGroup, { user: row.original });
    },
  },
];
