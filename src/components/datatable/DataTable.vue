<script lang="ts" setup>
import DataTablePagination from '@/components/datatable/DataTablePagination.vue';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FlexRender, Table as TanstackTable } from '@tanstack/vue-table';
import CustomTable from './CustomTable.vue';

interface Prop {
  table: TanstackTable<any>;
  isLoading?: boolean;
  static_header?: boolean;
  small_padding?: boolean;
}
defineProps<Prop>();
</script>

<template>
  <div class="space-y-4">
    <div class="rounded-md border">
      <CustomTable :class="static_header ? 'max-h-[800px]' : ''">
        <TableHeader :class="static_header ? 'sticky top-0 bg-muted shadow z-[35]' : ''">
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id" :class="small_padding ? 'px-1.5' : ''">
              <FlexRender
                v-if="!header.isPlaceholder && !header.column.columnDef.enableHiding"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="isLoading">
            <TableCell :colspan="table.getAllColumns().length" class="h-24 text-center">
              <div class="text-center">
                <div
                  class="m-12 text-center inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                  role="status"
                >
                  <span
                    class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                    >Loading...</span
                  >
                </div>
              </div></TableCell
            >
          </TableRow>
          <template v-else-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <!-- Hàng cha -->
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell
                  v-for="cell in row.getVisibleCells()"
                  :key="cell.id"
                  :class="small_padding ? 'py-1.5 px-2' : ''"
                >
                  <FlexRender
                    v-if="!cell.column.columnDef.enableHiding"
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </TableCell>
              </TableRow>
              <!-- Kiểm tra và hiển thị hàng con nếu có -->
              <template v-if="row.getIsExpanded() && row.subRows.length > 0">
                <TableRow v-for="subRow in row.subRows" :key="subRow.id" class="bg-accent/90">
                  <!-- Ô trống cho cột mở rộng -->
                  <TableCell v-for="cell in subRow.getVisibleCells()" :key="cell.id">
                    <FlexRender
                      v-if="!cell.column.columnDef.enableHiding"
                      :render="cell.column.columnDef.cell"
                      :props="cell.getContext()"
                    />
                  </TableCell>
                </TableRow>
              </template>
            </template>
          </template>

          <TableRow v-else>
            <TableCell :colspan="table.getAllColumns().length" class="h-24 text-center"> No results. </TableCell>
          </TableRow>
        </TableBody>
      </CustomTable>
    </div>

    <DataTablePagination :table="table" />
  </div>
</template>
