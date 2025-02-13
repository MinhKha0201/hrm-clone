import { SideBarItem } from '@/types';
import { CalendarDays, House, List, Mailbox, MessageCircleWarning, Presentation, User } from 'lucide-vue-next';
import { computed } from 'vue';
import { useAuthStore } from './auth.store';

export const systemSideBar = computed<SideBarItem[]>(() => {
  const authStore = useAuthStore();
  const sideBarItems: SideBarItem[] = [
    {
      id: '10000',
      name: 'Dashboard',
      path: '/',
      icon: House,
    },
    {
      id: '70000',
      name: 'Meeting schedule',
      path: '/meeting-schedule',
      icon: CalendarDays,
    },
  ];

  if (authStore.account?.department !== null && authStore.account?.department.isLeader) {
    sideBarItems.push({
      id: '60000',
      name: 'Received requests',
      path: '/received-requests',
      icon: Mailbox,
    });
  }

  if (!authStore.isAdmin) {
    sideBarItems.push({
      id: '30000',
      name: 'Request days off',
      path: '/request-days-off',
      icon: MessageCircleWarning,
    });
  }

  if (authStore.isAdmin) {
    sideBarItems.push(
      {
        id: '40000',
        name: 'List request',
        path: '/list-request',
        icon: List,
      },
      {
        id: '20000',
        name: 'Users',
        path: '/users',
        icon: User,
      },
      {
        id: '50000',
        name: 'Meeting Rooms',
        path: '/meeting-rooms',
        icon: Presentation,
      }
    );
  }

  return sideBarItems;
});
