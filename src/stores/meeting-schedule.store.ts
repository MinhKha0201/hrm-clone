import { defineStore } from 'pinia';
import { useAuthStore } from './auth.store';
import { ref } from 'vue';
import { CalendarEvent, IApiResponseV1 } from '@/types';
import { formatDate } from '@/lib/utils';
import { getLocalTimeFromISOString, getRandomTailwindColor } from '@/helper';
import axiosClient from '@/plugins';
import { MEETING_ROOM_API } from '@/constants/api/meeting-room.api';
import { BookingMeetingRoom } from '@/types/meeting-room.type';

export const useMeetingScheduleStore = defineStore('meeting-schedule', () => {
  const meetingSchedule = ref<CalendarEvent[]>([]);
  const meetingScheduleRes = ref<BookingMeetingRoom[]>([]);

  const getScheduleByUser = async (from_date?: string, to_date?: string) => {
    meetingSchedule.value = [];
    const authStore = useAuthStore();

    const { data, status } = await axiosClient.get<IApiResponseV1<BookingMeetingRoom[]>>(
      MEETING_ROOM_API.BOOKING_ROOMS_LIST,
      {
        params: {
          user_id: authStore.account?._id,
          from_date,
          to_date,
        },
      }
    );

    if (status >= 400) {
      return;
    }
    meetingScheduleRes.value = data.metadata;
    getMeetingScheduleList();
  };

  const getScheduleByRoom = async (id: string, from_date?: string, to_date?: string) => {
    const { data, status } = await axiosClient.get<IApiResponseV1<BookingMeetingRoom[]>>(
      MEETING_ROOM_API.BOOKING_ROOMS_LIST,
      {
        params: {
          room_id: id,
          from_date,
          to_date,
        },
      }
    );
    if (status >= 400) {
      return;
    }
    meetingScheduleRes.value = data.metadata;
    getMeetingScheduleList();
  };

  const getMeetingScheduleList = () => {
    const authStore = useAuthStore();
    meetingSchedule.value = [];
    meetingScheduleRes.value.forEach((item) => {
      const startD = formatDate(item.startDate, false) + ' ' + getLocalTimeFromISOString(item.startDate);
      const endD = formatDate(item.endDate, false) + ' ' + getLocalTimeFromISOString(item.endDate);

      const eventStyle = `${
        authStore.account?._id === item.requestBy._id ? 'owner' : 'not-owner'
      } !text-black hover:cursor-pointer`;
      const canEdit = item.requestBy._id === authStore.account?._id || authStore.isAdmin;

      meetingSchedule.value.push({
        id: item._id,
        title: item.meetingAgenda,
        start: startD,
        end: endD,
        class: eventStyle,
        deletable: canEdit,
        resizable: canEdit,
        draggable: canEdit,
      });
    });
  };

  return {
    meetingSchedule,
    meetingScheduleRes,
    getScheduleByUser,
    getScheduleByRoom,
    getMeetingScheduleList,
  };
});
