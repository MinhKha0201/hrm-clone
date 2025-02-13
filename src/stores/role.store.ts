import { ROLE_API } from '@/constants/api/role.api';
import axiosClient from '@/plugins';
import { IApiResponseV1, Role } from '@/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRoleStore = defineStore('role-store', () => {
  // define state
  const roles = ref<Role[]>([]);

  // define function
  const getRoles = async () => {
    const { data, status } = await axiosClient.get<IApiResponseV1<Role[]>>(ROLE_API.ROLE);
    if (status >= 400) {
      return;
    }
    roles.value = data.metadata;
  };

  return { roles, getRoles };
});
