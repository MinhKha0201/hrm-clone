<script setup lang="ts">
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-vue-next';

interface Prop {
  status: string;
}
defineProps<Prop>();

const emit = defineEmits(['click:view', 'click:edit', 'click:cancel']);

const handleView = () => {
  emit('click:view');
};

const handleCancel = () => {
  emit('click:cancel');
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" class="p-2 h-auto"> <Ellipsis :size="18" /> </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-40" align="end">
      <DropdownMenuItem v-if="status !== 'PENDING'" @click="handleView">
        <span>View</span>
      </DropdownMenuItem>
      <DropdownMenuItem v-if="status === 'PENDING'" @click="handleView">
        <span>Edit</span>
      </DropdownMenuItem>
      <DropdownMenuItem v-if="status === 'PENDING'" @click="handleCancel">
        <span>Cancel</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
