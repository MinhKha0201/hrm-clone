import axiosClient from '@/plugins';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { toast } from 'vue-sonner';
// import { useRoleStore } from './role.store';
import { USER_API } from '@/constants/api/user.api';
import { TOAST_MESSAGE } from '@/constants/toast-message.constant';
import { createAPIEndpoint } from '@/helper';
import { IApiResponseV1, User } from '@/types';
import { CreateUserData, UpdateUserData } from '@/components/user/schema';

export const useUserStore = defineStore('user-store', () => {
  // define state
  const users = ref<User[]>([]);

  // define function
  const getAllUser = async () => {
    const { data, status } = await axiosClient.get<IApiResponseV1<User[]>>(USER_API.USER_ALL);
    if (status >= 400) {
      return;
    }
    users.value = data.metadata;
  };

  const addUser = async (reqData: CreateUserData) => {
    const { data, status } = await axiosClient.post(USER_API.USER_ALL, {
      ...reqData,
    });
    if (status >= 400) {
      return status;
    }
    users.value = [{ ...data.metadata, shopsAssigned: [] }, ...users.value];
    toast.success(TOAST_MESSAGE.SUCCESS);
    return status;
  };

  const updateUser = async (id: string, reqData: UpdateUserData) => {
    const url = createAPIEndpoint(USER_API.USER_BY_ID, id);
    const { data, status } = await axiosClient.put(url, {
      ...reqData,
    });
    if (status >= 400) {
      return status;
    }
    const item = users.value.find((user) => user._id === id);
    if (item) {
      item.email = data.metadata.email;
      item.password = data.metadata.password;
      item.displayName = data.metadata.displayName;
      item.gender = data.metadata.gender;
      item.role = data.metadata.role;
    }
    users.value = [...users.value];
    toast.success(TOAST_MESSAGE.SUCCESS);
    return status;
  };

  const deleteUser = async (userId: string) => {
    const url = createAPIEndpoint(USER_API.USER_BY_ID, userId);
    const { status } = await axiosClient.delete(url);
    if (status >= 400) {
      return status;
    }
    const index = users.value.findIndex((user) => user._id === userId);
    if (index > -1) {
      users.value.splice(index, 1);
      users.value = [...users.value];
    }
    toast.success(TOAST_MESSAGE.SUCCESS);
    return status;
  };

  return {
    users,
    getAllUser,
    addUser,
    updateUser,
    deleteUser,
  };
});
