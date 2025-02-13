import { REQUEST_DAYS_OFF_API } from '@/constants/api/request-days-off.api';
import { TOAST_MESSAGE } from '@/constants/toast-message.constant';
import { createAPIEndpoint, format } from '@/helper';
import { RequestDaysOffData } from '@/components/request-days-off/schema';
import axiosClient from '@/plugins';
import router from '@/router';
import {
  ComboboxFilterType,
  IApiResponseV1,
  Prepare,
  RequestDayOffOverview,
  RequestDaysOff,
  RequestType,
} from '@/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { toast } from 'vue-sonner';

export const useRequestDaysOffStore = defineStore('request-days-off', () => {
  // define state
  const requestList = ref<RequestDaysOff[]>([]);
  const request = ref<RequestDaysOff>();
  const listRequestType = ref<RequestType[]>([]);
  const requestType = ref<ComboboxFilterType[]>([]);
  const approverAndSupervisor = ref<Prepare>();
  const overview = ref<RequestDayOffOverview>();
  const receivedRequests = ref<RequestDaysOff[]>([]);

  // define function
  const getAllRequest = async () => {
    const { data, status } = await axiosClient.get<IApiResponseV1<RequestDaysOff[]>>(REQUEST_DAYS_OFF_API.REQUESTS);
    if (status >= 400) {
      return;
    }
    requestList.value = data.metadata;
  };

  const getRequest = async (id: string) => {
    const { data, status } = await axiosClient.get<IApiResponseV1<RequestDaysOff>>(
      format(REQUEST_DAYS_OFF_API.REQUESTS_BY_ID, id)
    );
    if (status >= 400) {
      return;
    }
    request.value = data.metadata;
  };

  const getRequestOverview = async () => {
    const { data, status } = await axiosClient.get<IApiResponseV1<RequestDayOffOverview>>(
      REQUEST_DAYS_OFF_API.REQUEST_OVERVIEW
    );
    if (status >= 400) {
      return;
    }
    overview.value = data.metadata;
  };

  const createRequest = async (reqData: Omit<RequestDaysOffData, 'startTime' | 'endTime'>) => {
    const { data, status } = await axiosClient.post<IApiResponseV1<RequestDaysOff>>(
      REQUEST_DAYS_OFF_API.REQUESTS,
      reqData
    );

    if (status >= 400) {
      return status;
    }
    requestList.value.unshift(data.metadata);
    requestList.value = [...requestList.value];
    toast.success(TOAST_MESSAGE.SUCCESS, {
      description: 'Create request successfully',
    });
    return status;
  };
  const updateRequest = async (id: string, reqData: Omit<RequestDaysOffData, 'startTime' | 'endTime'>) => {
    const { data, status } = await axiosClient.put(createAPIEndpoint(REQUEST_DAYS_OFF_API.REQUESTS_BY_ID, id), reqData);
    if (status >= 400) {
      return status;
    }
    const date = new Date().toISOString();
    const request = requestList.value.find((item) => item._id === id);
    if (request) {
      request.updatedAt = date;
      Object.assign(request, reqData);
      toast.success(TOAST_MESSAGE.SUCCESS, {
        description: 'Update request successfully',
      });
      return status;
    }
    toast.error(TOAST_MESSAGE.ERROR, {
      description: 'Update request error',
    });
    return status;
  };

  const getRequestTypes = async () => {
    const { data, status } = await axiosClient.get<IApiResponseV1<RequestType[]>>(REQUEST_DAYS_OFF_API.REQUEST_TYPES);
    if (status >= 400) {
      return;
    }
    listRequestType.value = data.metadata;
    requestType.value = data.metadata.map((type) => {
      return {
        label: type.name,
        value: type._id,
      };
    });
  };

  const getListReasons = (requestTypeId: string): ComboboxFilterType[] => {
    return (
      listRequestType.value
        .find((requestType) => requestType._id === requestTypeId)
        ?.reasons.map((reason) => {
          return {
            label: reason.reason,
            value: reason._id,
          };
        }) || []
    );
  };

  const getReceivedRequests = async () => {
    const { data, status } = await axiosClient.get<IApiResponseV1<RequestDaysOff[]>>(
      REQUEST_DAYS_OFF_API.REQUEST_RECEIVED
    );
    if (status >= 400) {
      return;
    }
    receivedRequests.value = data.metadata;
  };

  const getApproverAndSupervisor = async (departmentId: string) => {
    const { data, status } = await axiosClient.get<IApiResponseV1<Prepare>>(
      format(REQUEST_DAYS_OFF_API.REQUEST_PREPARE_BY_DEPARTMENT, departmentId)
    );
    if (status >= 400) {
      return;
    }
    approverAndSupervisor.value = data.metadata;
  };

  const cancelRequest = async (id: string) => {
    const { data, status } = await axiosClient.patch(createAPIEndpoint(REQUEST_DAYS_OFF_API.REQUEST_CANCEL, id));
    if (status >= 400) {
      return status;
    }

    const item = requestList.value.find((request) => request._id === id);
    if (item) {
      item.status = data.metadata.status;
    }

    toast.success(TOAST_MESSAGE.SUCCESS);
    return status;
  };

  const approveRequest = async (id: string, message: string) => {
    const { data, status } = await axiosClient.patch(createAPIEndpoint(REQUEST_DAYS_OFF_API.REQUEST_APPROVE, id), {
      message,
    });
    if (status >= 400) {
      return status;
    }
    const item = receivedRequests.value.find((request) => request._id === id);
    if (item) {
      item.supervisor.acceptAt = data.metadata.supervisor.acceptAt;
    }
    toast.success(TOAST_MESSAGE.SUCCESS, {
      description: 'Approve request successfully',
    });
    return status;
  };

  const rejectRequest = async (id: string, rejectReason: string) => {
    const { data, status } = await axiosClient.patch(createAPIEndpoint(REQUEST_DAYS_OFF_API.REQUEST_REJECT, id), {
      message: rejectReason,
    });
    if (status >= 400) {
      return status;
    }
    const item = receivedRequests.value.find((request) => request._id === id);
    if (item) {
      item.supervisor.rejectAt = data.metadata.supervisor.rejectAt;
    }
    toast.success(TOAST_MESSAGE.SUCCESS, {
      description: 'Reject request successfully',
    });
    return status;
  };

  return {
    requestList,
    request,
    requestType,
    approverAndSupervisor,
    overview,
    receivedRequests,
    getAllRequest,
    getRequest,
    createRequest,
    updateRequest,
    getRequestTypes,
    getListReasons,
    getApproverAndSupervisor,
    getRequestOverview,
    getReceivedRequests,
    approveRequest,
    rejectRequest,
    cancelRequest,
  };
});
