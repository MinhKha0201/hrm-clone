import { Department } from '@/types/department.type';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth.store';
import axiosClient from '@/plugins';
import { DEPARTMENT_API } from '@/constants/api/department.api';
import { createAPIEndpoint } from '@/helper';
import { IApiResponseV1 } from '@/types';

export const useDepartmentStore = defineStore('department-store', () => {
  // define state
  const departments = ref<Department[]>([]);
  const department = ref<Department>();

  // define function
  const getDepartments = async () => {
    const { data, status } = await axiosClient.get<IApiResponseV1<Department[]>>(DEPARTMENT_API.DEPARTMENTS);
    if (status >= 400) {
      return;
    }
    departments.value = data.metadata;
  };

  const getDepartment = async () => {
    const authStore = useAuthStore();
    const { data, status } = await axiosClient.get<IApiResponseV1<Department>>(
      createAPIEndpoint(DEPARTMENT_API.DEPARTMENT_BY_ID, authStore.account?.department._id || '')
    );
    if (status >= 400) {
      return;
    }
    department.value = data.metadata;
  };

  const getDepartmentByID = (id: string) => {
    department.value = departments.value.find((item) => item._id === id);
  };

  return {
    departments,
    department,
    getDepartment,
    getDepartments,
    getDepartmentByID,
  };
});
