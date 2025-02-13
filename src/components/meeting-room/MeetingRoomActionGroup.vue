<script lang="ts" setup>
import ConfirmAlert from '@/components/base/ConfirmAlert.vue';
import Button from '@/components/ui/button/Button.vue';
import { useModalStore } from '@/stores';
import { useMeetingRoomStore } from '@/stores/meeting-room.store';
import { MeetingRoom } from '@/types/meeting-room.type';
import { Pencil, Trash2 } from 'lucide-vue-next';

const modalStore = useModalStore();
const meetingRoomStore = useMeetingRoomStore();

interface Prop {
  meeting_room: MeetingRoom;
}
const props = defineProps<Prop>();

const handleOpenModal = () => {
  modalStore.data = props.meeting_room;
  modalStore.isOpen = true;
};

const handleDelete = async () => {
  await meetingRoomStore.deleteMeetingRoom(props.meeting_room._id);
};
</script>
<template>
  <div class="flex gap-2">
    <Button @click="handleOpenModal" class="p-2 h-fit bg-yellow-500 hover:bg-yellow-500"><Pencil :size="16" /></Button>
    <ConfirmAlert :type="'error'" @click="handleDelete">
      <Button class="p-2 h-fit bg-red-500 hover:bg-red-500"><Trash2 :size="16" /></Button>
    </ConfirmAlert>
  </div>
</template>
