<script lang="ts" setup>
import ConfirmAlert from '@/components/base/ConfirmAlert.vue';
import Button from '@/components/ui/button/Button.vue';
import { useModalStore, useUserStore } from '@/stores';
import { User } from '@/types';
import { Pencil, Trash2 } from 'lucide-vue-next';

interface Prop {
  user: User;
}
const props = defineProps<Prop>();
const modalStore = useModalStore();
const userStore = useUserStore();

const handleClick = () => {
  modalStore.isOpen = true;
  modalStore.data = props.user;
};

const handleDelete = async () => {
  await userStore.deleteUser(props.user._id);
};
</script>
<template>
  <div class="flex gap-2">
    <Button class="p-2 h-fit bg-yellow-500 hover:bg-yellow-500" @click="handleClick"><Pencil :size="16" /></Button>
    <ConfirmAlert @click="handleDelete" type="error">
      <Button class="p-2 h-fit bg-red-500 hover:bg-red-500"><Trash2 :size="16" /></Button
    ></ConfirmAlert>
  </div>
</template>
