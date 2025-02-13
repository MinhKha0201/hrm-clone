<script lang="ts" setup>
import Button from '@/components/ui/button/Button.vue';
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue';
import router from '@/router';
import { useDepartmentStore, useUserStore } from '@/stores';
import { useMeetingRoomStore } from '@/stores/meeting-room.store';
import { ComboboxFilterType } from '@/types';
import { MeetingRoom } from '@/types/meeting-room.type';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userStore = useUserStore();
const meetingRoomStore = useMeetingRoomStore();
const departmentStore = useDepartmentStore();

const id = computed(() => route.params.id as string);
const listRoom = ref<MeetingRoom[]>([]);
const listRoomCombobox = ref<ComboboxFilterType[]>([]);
const listLocaltionCombobox = ref<ComboboxFilterType[]>([]);

onMounted(async () => {
  if (userStore.users.length === 0) await userStore.getAllUser();
  if (meetingRoomStore.meetingRooms.length === 0) await meetingRoomStore.getAllMeetingRoom();
  if (departmentStore.departments.length === 0) await departmentStore.getDepartments();

  if (id.value) {
    await meetingRoomStore.getBookingRoom(id.value);
  }

  listRoom.value = meetingRoomStore.meetingRooms;

  listRoomCombobox.value = meetingRoomStore.meetingRooms.map((room) => {
    return {
      label: room.name,
      value: room._id,
    };
  });
  listLocaltionCombobox.value = Array.from(new Set(meetingRoomStore.meetingRooms.map((room) => room.location))).map(
    (location) => {
      return {
        label: location,
        value: location,
      };
    }
  );
});

const handleSelectRoom = (id: string) => {
  router.push(`/book-a-room/room-schedule/${id}`);
};
</script>
<template>
  <div>
    <h1 class="text-xl font-normal">Booking rooms</h1>
    <ScrollArea class="h-[750px] rounded-md mt-4">
      <div class="flex flex-col gap-2 mr-2.5">
        <div v-for="item in listRoom" :key="item._id" class="flex gap-4 border p-4 rounded-md">
          <div class="w-[200px] h-[120px] rounded-md overflow-hidden">
            <img
              src="https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?cs=srgb&dl=pexels-fotoaibe-1669799.jpg&fm=jpg"
              alt=""
              class="w-full h-full"
            />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-medium">{{ item.name }}</h3>
            <p class="text-sm mt-4">Seating Capacity: {{ item.seating }}</p>
            <p class="text-sm mt-4">Location: {{ item.location }}</p>
          </div>
          <div class="flex flex-col items-end">
            <p class="text-end font-medium text-green-500">{{ item.status }}</p>
            <Button type="button" class="mt-4" @click="handleSelectRoom(item._id)">Book</Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  </div>
</template>
