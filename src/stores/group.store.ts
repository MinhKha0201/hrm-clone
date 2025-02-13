import { GROUP_API } from '@/constants/api/group.api';
import { TOAST_MESSAGE } from '@/constants/toast-message.constant';
import { createAPIEndpoint } from '@/helper';
import axiosClient from '@/plugins';
import { IApiResponseV1 } from '@/types';
import { CreateGroup, Group } from '@/types/group.type';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { toast } from 'vue-sonner';

export const useGroupStore = defineStore('group-store', () => {
  const groups = ref<Group[]>([]);

  const getAllGroup = async () => {
    const { data, status } = await axiosClient.get<IApiResponseV1<Group[]>>(GROUP_API.GROUPS);
    if (status >= 400) {
      return;
    }
    groups.value = data.metadata;
  };

  const createGroup = async (payload: CreateGroup) => {
    const { data, status } = await axiosClient.post<IApiResponseV1<Group>>(GROUP_API.GROUPS, payload);
    if (status >= 400) {
      return status;
    }
    groups.value.push(data.metadata);
    toast.success(TOAST_MESSAGE.SUCCESS, { description: 'Create Group Success' });
    return status;
  };

  const updateGroup = async (id: string, payload: Partial<CreateGroup>) => {
    const { data, status } = await axiosClient.put<IApiResponseV1<Group>>(
      createAPIEndpoint(GROUP_API.GROUP_BY_ID, id),
      payload
    );
    if (status >= 400) {
      return status;
    }
    const item = groups.value.find((group) => group._id === id);
    if (item) {
      Object.assign(item, data.metadata);
    }
    toast.success(TOAST_MESSAGE.SUCCESS, { description: 'Update Group Success' });
    return status;
  };

  return {
    groups,
    getAllGroup,
    createGroup,
    updateGroup,
  };
});
