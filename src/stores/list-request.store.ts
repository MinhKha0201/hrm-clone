import { IApiResponseV1, RequestDaysOff } from '@/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth.store';
import axiosClient from '@/plugins';
import { createAPIEndpoint } from '@/helper';
import { REQUEST_DAYS_OFF_API } from '@/constants/api/request-days-off.api';
import { TOAST_MESSAGE } from '@/constants/toast-message.constant';
import { toast } from 'vue-sonner';

export const useListRequestStore = defineStore('list-request', () => {
  // define state
  const requests = ref<RequestDaysOff[]>([]);
  const request = ref<RequestDaysOff>();

  // define function
  const getAllRequest = async () => {
    const { data, status } = await axiosClient.get<IApiResponseV1<RequestDaysOff[]>>(REQUEST_DAYS_OFF_API.REQUESTS);
    if (status >= 400) {
      return;
    }
    requests.value = data.metadata;
  };

  const getRequest = (id: string) => {
    request.value = requests.value.find((request) => request._id === id);
  };

  const updateRequest = (id: string, status: 'ACCEPT' | 'REJECT') => {
    // const item = requests.value.find((request) => request._id === id);
    // const authStore = useAuthStore();
    // if (item) {
    //   item.status = status;
    //   item.reviewer = authStore.account?.email;
    //   item.acceptedAt = new Date().toLocaleString();
    // }
    // requests.value = [...requests.value];
    // console.log(requests.value);
  };

  const approveRequest = async (id: string, message: string) => {
    const { data, status } = await axiosClient.patch(createAPIEndpoint(REQUEST_DAYS_OFF_API.REQUEST_APPROVE, id), {
      message,
    });
    if (status >= 400) {
      return status;
    }
    const item = requests.value.find((request) => request._id === id);
    if (item) {
      item.status = data.metadata.status;
      item.approver.acceptAt = data.metadata.approver.acceptAt;
    }
    toast.success(TOAST_MESSAGE.SUCCESS, {
      description: 'Approve request successfully',
    });
    return status;
  };

  const rejectRequest = async (id: string, message: string) => {
    const { data, status } = await axiosClient.patch(createAPIEndpoint(REQUEST_DAYS_OFF_API.REQUEST_REJECT, id), {
      message,
    });
    if (status >= 400) {
      return status;
    }
    const item = requests.value.find((request) => request._id === id);
    if (item) {
      item.status = data.metadata.status;
      item.approver.rejectAt = data.metadata.approver.rejectAt;
    }
    toast.success(TOAST_MESSAGE.SUCCESS, {
      description: 'Reject request successfully',
    });
    return status;
  };

  return {
    requests,
    request,
    getAllRequest,
    getRequest,
    updateRequest,
    approveRequest,
    rejectRequest,
  };
});
