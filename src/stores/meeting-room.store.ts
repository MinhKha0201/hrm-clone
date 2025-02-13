import { RequestBookARoomData } from '@/components/dashboard/schema';
import { MeetingRoomData } from '@/components/meeting-room/schema';
import { MEETING_ROOM_API } from '@/constants/api/meeting-room.api';
import { TOAST_MESSAGE } from '@/constants/toast-message.constant';
import { createAPIEndpoint } from '@/helper';
import axiosClient from '@/plugins';
import { IApiResponseV1 } from '@/types';
import { BookingMeetingRoom, MeetingRoom } from '@/types/meeting-room.type';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { useAuthStore } from './auth.store';
import { useMeetingScheduleStore } from './meeting-schedule.store';

export const useMeetingRoomStore = defineStore('meeting-room-store', () => {
  // Define state
  const bookingMeetingRooms = ref<BookingMeetingRoom[]>([]);
  const bookingRoom = ref<BookingMeetingRoom>();
  const meetingRooms = ref<MeetingRoom[]>([]);
  const roomsAvailable = ref<MeetingRoom[]>([]);

  // Define function
  const getAllBookingMeetingRooms = async () => {
    const authStore = useAuthStore();
    const { data, status } = await axiosClient.get<IApiResponseV1<BookingMeetingRoom[]>>(
      MEETING_ROOM_API.BOOKING_ROOMS_LIST,
      {
        params: {
          user_id: authStore.account?._id,
        },
      }
    );
    if (status >= 400) {
      return;
    }
    bookingMeetingRooms.value = data.metadata;
  };

  const getBookingRoom = async (id: string) => {
    const { data, status } = await axiosClient.get<IApiResponseV1<BookingMeetingRoom>>(
      createAPIEndpoint(MEETING_ROOM_API.BOOKING_ROOMS_BY_ID, id)
    );
    if (status >= 400) {
      return;
    }
    bookingRoom.value = data.metadata;
  };

  const createBooking = async (payload: Omit<RequestBookARoomData, 'start_time' | 'end_time'>) => {
    const { data, status } = await axiosClient.post<IApiResponseV1<BookingMeetingRoom>>(
      createAPIEndpoint(MEETING_ROOM_API.CREATE_BOOKING, payload.roomId),
      payload
    );
    if (status >= 400) {
      return status;
    }

    bookingMeetingRooms.value.push(data.metadata);

    const meetingScheduleStore = useMeetingScheduleStore();
    meetingScheduleStore.meetingScheduleRes.push(data.metadata);

    toast.success(TOAST_MESSAGE.SUCCESS);
    return status;
  };

  const updateBooking = async (id: string, payload: Partial<RequestBookARoomData>) => {
    const { data, status } = await axiosClient.put<IApiResponseV1<BookingMeetingRoom>>(
      createAPIEndpoint(MEETING_ROOM_API.BOOKING_ROOMS_BY_ID, id),
      payload
    );
    if (status >= 400) {
      return status;
    }

    const meetingScheduleStore = useMeetingScheduleStore();
    const booking = meetingScheduleStore.meetingScheduleRes.find((item) => item._id === id);
    if (booking) {
      booking.attendees = data.metadata.attendees;
      booking.startDate = data.metadata.startDate;
      booking.endDate = data.metadata.endDate;
      booking.meetingAgenda = data.metadata.meetingAgenda;
    }

    toast.success(TOAST_MESSAGE.SUCCESS);
    return status;
  };

  const cancelBooking = async (id: string) => {
    const { data, status } = await axiosClient.delete(createAPIEndpoint(MEETING_ROOM_API.CANCEL_BOOKING, id));
    if (status >= 400) {
      return status;
    }
    const meetingScheduleStore = useMeetingScheduleStore();
    const index = meetingScheduleStore.meetingSchedule.findIndex((item) => item.id === id);
    if (index >= 0) {
      meetingScheduleStore.meetingSchedule.splice(index, 1);
    }
    toast.success(TOAST_MESSAGE.SUCCESS);
    return status;
  };

  const checkAvailable = async (startDate: string, endDate: string) => {
    const { data, status } = await axiosClient.get<IApiResponseV1<MeetingRoom[]>>(
      MEETING_ROOM_API.MEETING_ROOMS_AVAILABLE,
      {
        params: { startDate, endDate },
      }
    );
    if (status >= 400) {
      return;
    }
    roomsAvailable.value = data.metadata;
  };

  const getAllMeetingRoom = async () => {
    const { data, status } = await axiosClient.get<IApiResponseV1<MeetingRoom[]>>(MEETING_ROOM_API.MEETING_ROOMS);
    if (status >= 400) {
      return;
    }
    meetingRooms.value = data.metadata;
  };

  const createMeetingRoom = async (payload: MeetingRoomData) => {
    const { data, status } = await axiosClient.post<IApiResponseV1<MeetingRoom>>(MEETING_ROOM_API.MEETING_ROOMS, {
      ...payload,
    });
    if (status >= 400) {
      return status;
    }

    meetingRooms.value.unshift(data.metadata);
    meetingRooms.value = [...meetingRooms.value];
    toast.success(TOAST_MESSAGE.SUCCESS);
    return status;
  };

  const updateMeetingRoom = async (id: string, payload: MeetingRoomData) => {
    const { data, status } = await axiosClient.put<IApiResponseV1<MeetingRoom>>(
      createAPIEndpoint(MEETING_ROOM_API.MEETING_ROOMS_BY_ID, id),
      {
        ...payload,
      }
    );
    if (status >= 400) {
      return status;
    }

    const item = meetingRooms.value.find((room) => room._id === id);
    if (item) {
      item.description = payload.description;
      item.location = payload.location;
      item.seating = payload.seating;
      item.name = payload.name;
      item.status = data.metadata.status;
      item.updatedAt = data.metadata.updatedAt;
    }

    meetingRooms.value = [...meetingRooms.value];

    toast.success(TOAST_MESSAGE.SUCCESS);
    return status;
  };

  const deleteMeetingRoom = async (id: string) => {
    const { status } = await axiosClient.delete<IApiResponseV1<MeetingRoom>>(
      createAPIEndpoint(MEETING_ROOM_API.MEETING_ROOMS_BY_ID, id)
    );
    if (status >= 400) {
      return status;
    }
    const index = meetingRooms.value.findIndex((room) => room._id === id);
    if (index >= 0) {
      meetingRooms.value.splice(index, 1);
    }
    meetingRooms.value = [...meetingRooms.value];
    toast.success(TOAST_MESSAGE.SUCCESS);
  };

  return {
    bookingMeetingRooms,
    meetingRooms,
    roomsAvailable,
    bookingRoom,
    getAllBookingMeetingRooms,
    getAllMeetingRoom,
    createMeetingRoom,
    updateMeetingRoom,
    deleteMeetingRoom,
    checkAvailable,
    createBooking,
    getBookingRoom,
    updateBooking,
    cancelBooking,
  };
});
