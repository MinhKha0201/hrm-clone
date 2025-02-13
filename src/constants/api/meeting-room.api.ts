export enum MEETING_ROOM_API {
  MEETING_ROOMS = 'rooms',
  MEETING_ROOMS_BY_ID = 'rooms/%s',
  MEETING_ROOMS_AVAILABLE = 'rooms/available',

  BOOKING_ROOMS_LIST = 'rooms/bookings/list',
  BOOKING_ROOMS_BY_ID = 'rooms/bookings/%s',
  CREATE_BOOKING = 'rooms/%s/booking',
  CANCEL_BOOKING = 'rooms/bookings/%s/cancel',
}
