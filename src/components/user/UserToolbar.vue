<script setup lang="ts">
import { Button } from '@/components/ui/button';
import type { Table } from '@tanstack/vue-table';

import DataTableFacetedFilter from '@/components/datatable/DataTableFacetedFilter.vue';
import { Input } from '@/components/ui/input';
import { ROLE } from '@/constants';
import { User } from '@/types';
import { X } from 'lucide-vue-next';
import { computed, onMounted } from 'vue';
import { useDepartmentStore } from '@/stores';

const departmentStore = useDepartmentStore();

onMounted(async () => {
  if (departmentStore.departments.length === 0) await departmentStore.getDepartments();
});

interface DataTableToolbarProps {
  table: Table<User>;
}

const props = defineProps<DataTableToolbarProps>();

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0);
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-1 gap-2 items-center space-x-2">
      <Input
        placeholder="Search user..."
        :model-value="(table.getColumn('displayName')?.getFilterValue() as string) ?? ''"
        class="h-auto w-[150px] lg:w-[250px] !ml-0"
        @input="table.getColumn('displayName')?.setFilterValue($event.target.value)"
      />

      <DataTableFacetedFilter
        v-if="table.getColumn('role.name')"
        :column="table.getColumn('role.name')"
        title="Role"
        :options="
          Object.values(ROLE).map((item) => {
            return {
              label: item,
              value: item,
            };
          })
        "
      />
      <DataTableFacetedFilter
        v-if="table.getColumn('department')"
        :column="table.getColumn('department')"
        title="Department"
        :options="
          departmentStore.departments.map((department) => {
            return {
              label: department.name,
              value: department._id,
            };
          })
        "
      />
      <Button v-if="isFiltered" variant="outline" class="h-auto px-2 lg:px-3" @click="table.resetColumnFilters()">
        Reset
        <X class="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
