const webRoute = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/auth/Login.vue'),
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/pages/auth/ForgotPassword.vue'),
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/pages/auth/ResetPassword.vue'),
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/layouts/main/MainLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'Dashboard page',
        component: () => import('@/pages/dashboard/Dashboard.vue'),
      },
      {
        path: '/users',
        name: 'Users page',
        meta: { requiresAdmin: true },
        component: () => import('@/pages/users/Users.vue'),
      },
      {
        path: '/request-days-off',
        name: 'Request days off',
        component: () => import('@/pages/request-days-off/RequestDaysOff.vue'),
      },
      {
        path: '/request-days-off/create-new-request',
        name: 'Create new request',
        component: () => import('@/pages/request-days-off/create-new-request/CreateNewRequest.vue'),
      },
      {
        path: '/request-days-off/:id',
        name: 'Edit request',
        component: () => import('@/pages/request-days-off/create-new-request/CreateNewRequest.vue'),
      },
      {
        path: '/list-request',
        name: 'List request',
        meta: { requiresAdmin: true },
        component: () => import('@/pages/list-request/ListRequest.vue'),
      },
      {
        path: '/list-request/:id',
        name: 'Request detail',
        meta: { requiresAdmin: true },
        component: () => import('@/components/list-request/RequestDetails.vue'),
      },
      {
        path: '/book-a-room',
        name: 'Book a room',
        component: () => import('@/pages/dashboard/Book-a-room/BookARoom.vue'),
      },
      {
        path: '/edit-booking/:id',
        name: 'Edit booking',
        component: () => import('@/pages/dashboard/Book-a-room/BookARoom.vue'),
      },
      {
        path: '/meeting-rooms',
        name: 'Meeting rooms',
        meta: { requiresAdmin: true },
        component: () => import('@/pages/meeting-room/MeetingRoom.vue'),
      },
      {
        path: '/meeting-schedule',
        name: 'Meeting schedule',
        component: () => import('@/pages/meeting-schedule/MeetingSchedule.vue'),
      },
      {
        path: '/received-requests',
        name: 'Received requests',
        component: () => import('@/pages/received-requests/ReceivedRequests.vue'),
      },
      {
        path: '/received-requests/:id',
        name: 'Request details',
        component: () => import('@/components/list-request/RequestDetails.vue'),
      },
      {
        path: '/book-a-room/room-schedule/:id',
        name: 'Room schedule',
        component: () => import('@/pages/dashboard/Book-a-room/room-schedule/RoomSchedule.vue'),
      },
      {
        path: '/book-a-room/edit/:id',
        name: 'Edit room schedule',
        component: () => import('@/pages/dashboard/Book-a-room/room-schedule/EditBooking.vue'),
      },
    ],
  },
];

export default webRoute;
