<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserRound } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores';
import router from '@/router';

const userAvatar = 'https://preview.keenthemes.com/keen/demo1/assets/media/avatars/300-3.jpg';

const authStore = useAuthStore();

const handleSignOut = async () => {
  await authStore.logout();
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <div>
        <div class="w-max flex items-center space-x-2 p-2 text-foreground hover:bg-transparent cursor-pointer">
          <div
            class="w-10 h-10 rounded-md flex items-center justify-center overflow-hidden"
            :class="{ border: !userAvatar }"
          >
            <img v-if="userAvatar" :src="userAvatar" alt="user-avatar" loading="lazy" />
            <span v-else> <UserRound class="w-6 h-6" /> </span>
          </div>
          <div class="user-info space-y-1">
            <h3 class="font-semibold text-sm">
              {{ authStore?.account?.displayName }}
            </h3>
            <p class="m-0 text-xs">{{ authStore?.account?.role?.name }}</p>
          </div>
        </div>
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" align="end">
      <DropdownMenuLabel class="font-normal flex">
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium leading-none">
            {{ authStore?.account?.displayName }}
          </p>
          <p class="text-xs leading-none text-muted-foreground">
            {{ authStore?.account?.email }}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <!-- <DropdownMenuItem> Profile </DropdownMenuItem>
        <DropdownMenuItem> Billing </DropdownMenuItem>
        <DropdownMenuItem> Settings </DropdownMenuItem>
        <DropdownMenuItem>New Team</DropdownMenuItem> -->
        <DropdownMenuItem>
          <Button
            class="p-0 text-inherit bg-inherit hover:bg-inherit font-normal h-6 w-full block text-left"
            @click="
              () => {
                router.push('/account/change-password');
              }
            "
            >Change password
          </Button>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Button
          class="p-0 text-inherit bg-inherit hover:bg-inherit w-full h-6 justify-start font-normal"
          @click="handleSignOut"
          >Sign out
        </Button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
