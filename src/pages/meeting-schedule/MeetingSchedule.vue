<script lang="ts" setup>
import ConfirmAlert from '@/components/base/ConfirmAlert.vue';
import BookingModal from '@/components/BookingModal.vue';
import Button from '@/components/ui/button/Button.vue';
import Calendar from '@/components/ui/calendar/Calendar.vue';
import Dialog from '@/components/ui/dialog/Dialog.vue';
import DialogContent from '@/components/ui/dialog/DialogContent.vue';
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue';
import DialogFooter from '@/components/ui/dialog/DialogFooter.vue';
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue';
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue';
import { createISOString, getLocalTime, getLocalTimeFromISOString, getWeekStartAndEnd } from '@/helper';
import { formatDate } from '@/lib/utils';
import router from '@/router';
import { useAuthStore, useMeetingScheduleStore } from '@/stores';
import { useMeetingRoomStore } from '@/stores/meeting-room.store';
import { DateValue } from '@internationalized/date';
import {
  Calendar as CalendarIcon,
  Captions,
  Clock,
  Copy,
  Link,
  LocateFixed,
  MapPin,
  Pencil,
  Trash2,
  User,
} from 'lucide-vue-next';
import { computed, onMounted, reactive, ref } from 'vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import { toast } from 'vue-sonner';

const authStore = useAuthStore();
const meetingScheduleStore = useMeetingScheduleStore();
const meetingRoomStore = useMeetingRoomStore();

const isOpenDialog = ref(false);
const currentDate = ref<DateValue>();
const isOpenModal = ref(false);
const data = reactive({
  date: '',
  start_time: '',
  end_time: '',
  room: undefined,
  location: undefined,
});

onMounted(async () => {
  const { firstDayOfWeek, lastDayOfWeek } = getWeekStartAndEnd();
  await meetingScheduleStore.getScheduleByUser(formatDate(firstDayOfWeek, false), formatDate(lastDayOfWeek, false));
});

const onEventClick = async (event: any, e: MouseEvent) => {
  const id = event.id;
  await meetingRoomStore.getBookingRoom(id);
  isOpenDialog.value = true;
};

const onViewChange = async (payload: any) => {
  await meetingScheduleStore.getScheduleByUser(
    formatDate(payload.startDate, false),
    formatDate(payload.endDate, false)
  );
};

const handleSelectDate = (payload: DateValue | undefined) => {
  currentDate.value = payload;
};

const handleCellClick = (value: any) => {
  isOpenModal.value = true;
  data.date = formatDate(value.start as string, false);
  data.start_time = getLocalTime(value.start);
  data.end_time = getLocalTime(value.end);
};

const handleOpenModal = (open: boolean) => {
  isOpenModal.value = open;
};

const handleOpenDialog = (open: boolean) => {
  if (!open) {
    isOpenDialog.value = open;
  }
};

const handleChangeDuration = async (payload: any) => {
  const id = payload.event.id;
  const startDate = createISOString(
    formatDate(payload.event.start, false),
    getLocalTimeFromISOString(payload.event.start)
  );
  const endDate = createISOString(formatDate(payload.event.end, false), getLocalTimeFromISOString(payload.event.end));
  const status = await meetingRoomStore.updateBooking(id, { startDate, endDate });
  if (status >= 400) meetingScheduleStore.getMeetingScheduleList();
};

const handleCancel = async () => {
  const status = await meetingRoomStore.cancelBooking(meetingRoomStore.bookingRoom?._id!);

  if (status === 204) {
    isOpenDialog.value = false;
  }
};

const handleEdit = () => {
  router.push(`/book-a-room/edit/${meetingRoomStore.bookingRoom?._id}`);
};

const handleCopy = () => {
  if (meetingRoomStore.bookingRoom?.meetingLink) {
    navigator.clipboard.writeText(meetingRoomStore.bookingRoom?.meetingLink);
    setTimeout(() => {
      toast.success('Copied link!');
    }, 100);
  } else {
    setTimeout(() => {
      toast.warning('No value for copy');
    }, 100);
  }
};
</script>
<template>
  <div class="flex gap-4">
    <div>
      <Calendar
        v-model="currentDate"
        :weekday-format="'short'"
        class="rounded-md border"
        @update:model-value="handleSelectDate"
      />
    </div>
    <div class="flex-1">
      <vue-cal
        :selected-date="currentDate?.toString()"
        :disable-views="['years', 'year', 'month']"
        :time-from="8 * 60"
        :time-to="19 * 60"
        :time-step="30"
        :snap-to-time="15"
        :events="meetingScheduleStore.meetingSchedule"
        class="!h-fit border-gray-200 rounded overflow-hidden mr-2.5"
        :on-event-click="onEventClick"
        @view-change="onViewChange"
        :editable-events="{ title: false, drag: true, resize: true, delete: true, create: true }"
        @event-drag-create="handleCellClick"
        @event-drop="handleChangeDuration"
        @event-duration-change="handleChangeDuration"
      />
    </div>
  </div>
  <Dialog :open="isOpenDialog" @update:open="handleOpenDialog">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>View Event Details</DialogTitle>
        <DialogDescription> </DialogDescription>
      </DialogHeader>
      <div class="flex flex-col gap-2">
        <div class="flex gap-4 items-center">
          <LocateFixed :size="20" />
          Meeting room: {{ meetingRoomStore.bookingRoom?.room.name }}
        </div>
        <div class="flex gap-4 items-center">
          <CalendarIcon :size="20" />
          Date: {{ formatDate(meetingRoomStore.bookingRoom?.startDate!, false) }}
        </div>
        <div class="flex gap-4 items-center">
          <Clock :size="20" />
          Time: {{ getLocalTimeFromISOString(meetingRoomStore.bookingRoom?.startDate!) }}-{{
            getLocalTimeFromISOString(meetingRoomStore.bookingRoom?.endDate!)
          }}
        </div>
        <div class="flex gap-4 items-center">
          <MapPin :size="20" />
          Location: {{ meetingRoomStore.bookingRoom?.room.location }}
        </div>
        <div class="flex gap-4 items-center">
          <Captions :size="20" />
          Title: {{ meetingRoomStore.bookingRoom?.meetingAgenda }}
        </div>
        <div v-if="meetingRoomStore.bookingRoom?.meetingLink" class="flex gap-4 items-center">
          <Link :size="20" />
          Link:
          <a
            :href="meetingRoomStore.bookingRoom?.meetingLink"
            target="_blank"
            class="border rounded-md px-4 py-1 bg-blue-500 text-white"
            >Join</a
          >
          <Button class="h-auto px-2" variant="outline" @click="handleCopy"><Copy :size="16" /></Button>
        </div>
        <div class="flex gap-4 items-center">
          <User :size="20" />
          Request by: {{ meetingRoomStore.bookingRoom?.requestBy.displayName }}
        </div>
      </div>

      <DialogFooter class="flex sm:justify-end">
        <ConfirmAlert
          v-if="meetingRoomStore.bookingRoom?.requestBy._id === authStore.account?._id || authStore.isAdmin"
          type="error"
          @click="handleCancel"
        >
          <Button class="bg-red-500 hover:bg-red-500"><Trash2 :size="16" /></Button>
        </ConfirmAlert>
        <Button class="gap-2 bg-yellow-500 hover:bg-yellow-500" @click="handleEdit"><Pencil :size="16" /> </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  <BookingModal @update:open="handleOpenModal" :model-value="isOpenModal" v-bind="{ ...data }" type="user" />
</template>
<style>
.vuecal__menu,
.vuecal__cell-events-count {
  background-color: #42b983;
  color: white;
}
.vuecal__title-bar {
  background-color: #e4f5ef;
  color: black;
  font-size: 18px;
}
.vuecal__cell--today,
.vuecal__cell--current {
  background-color: rgba(240, 240, 255, 0.4);
}
.vuecal:not(.vuecal--day-view) .vuecal__cell--selected {
  background-color: rgba(235, 255, 245, 0.4);
}
.vuecal__cell--selected:before {
  border-color: rgba(66, 185, 131, 0.5);
}
.vuecal__no-event {
  display: none !important;
}
.vuecal--full-height-delete {
  height: 100px;
}

.owner {
  background-color: #bbf7d0 !important;
  border-color: #86efac;
  border-width: 2px;
  border-radius: 4px;
}

.not-owner {
  background-color: #bfdbfe !important;
  border-color: #93c5fd;
  border-width: 2px;
  border-radius: 4px;
}

.vuecal__event {
  background-color: rgba(76, 172, 175, 0.35);
}
.red {
  background-color: #fecaca;
  border-color: #fca5a5;
  border-width: 2px;
  border-radius: 4px;
}
.blue {
  background-color: #bfdbfe;
  border-color: #93c5fd;
  border-width: 2px;
  border-radius: 4px;
}
.green {
  background-color: #bbf7d0;
  border-color: #86efac;
  border-width: 2px;
  border-radius: 4px;
}
.yellow {
  background-color: #fef08a;
  border-color: #fde047;
  border-width: 2px;
  border-radius: 4px;
}
.purple {
  background-color: #e9d5ff;
  border-color: #d8b4fe;
  border-width: 2px;
  border-radius: 4px;
}
.pink {
  background-color: #fbcfe8;
  border-color: #f9a8d4;
  border-width: 2px;
  border-radius: 4px;
}
.teal {
  background-color: #99f6e4;
  border-color: #5eead4;
  border-width: 2px;
  border-radius: 4px;
}
.cyan {
  background-color: #a5f3fc;
  border-color: #67e8f9;
  border-width: 2px;
  border-radius: 4px;
}
.lime {
  background-color: #d9f99d;
  border-color: #bef264;
  border-width: 2px;
  border-radius: 4px;
}
.amber {
  background-color: #fde68a;
  border-color: #fcd34d;
  border-width: 2px;
  border-radius: 4px;
}
.orange {
  background-color: #fed7aa;
  border-color: #fdba74;
  border-width: 2px;
  border-radius: 4px;
}
.indigo {
  background-color: #c7d2fe;
  border-color: #a5b4fc;
  border-width: 2px;
  border-radius: 4px;
}
.emerald {
  background-color: #a7f3d0;
  border-color: #6ee7b7;
  border-width: 2px;
  border-radius: 4px;
}
.violet {
  background-color: #ddd6fe;
  border-color: #c4b5fd;
  border-width: 2px;
  border-radius: 4px;
}
.rose {
  background-color: #fecdd3;
  border-color: #fda4af;
  border-width: 2px;
  border-radius: 4px;
}
</style>
