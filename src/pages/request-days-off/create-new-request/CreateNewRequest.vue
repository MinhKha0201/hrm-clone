<script lang="ts" setup>
import DateTimeInputFormField from '@/components/base/DateTimeInputFormField.vue';
import InputWithSelectFormField from '@/components/base/InputWithSelectFormField.vue';
import SelectFormField from '@/components/base/SelectFormField.vue';
import TextareaFormField from '@/components/base/TextareaFormField.vue';
import Badge from '@/components/ui/badge/Badge.vue';
import Button from '@/components/ui/button/Button.vue';
import { FormField } from '@/components/ui/form';
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';
import Textarea from '@/components/ui/textarea/Textarea.vue';
import { STATUS_STYLE } from '@/constants';
import router from '@/router';
import { useAuthStore } from '@/stores';
import { useRequestDaysOffStore } from '@/stores/request-days-off.store';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { RequestDaysOffData, RequestDaysOffSchema } from '../../../components/request-days-off/schema';
import { createISOString, getLocalTimeFromISOString } from '@/helper';
import { formatDate } from '@/lib/utils';

const route = useRoute();
const store = useRequestDaysOffStore();
const authStore = useAuthStore();

const formSchema = toTypedSchema(RequestDaysOffSchema);

const { handleSubmit, setFieldValue, values } = useForm({
  validationSchema: formSchema,
});

const requestId = computed(() => route.params.id as string);
const listReasons = computed(() => store.getListReasons(values.requestTypeId as string));
const minDate = computed(() => new Date().toISOString().slice(0, 16));

onMounted(async () => {
  if (!store.approverAndSupervisor) await store.getApproverAndSupervisor(authStore.account?.department._id as string);
  if (store.requestType.length === 0) await store.getRequestTypes();
  if (requestId.value) {
    await store.getRequest(requestId.value);
    setFieldValue('requestTypeId', store.request?.requestType._id);
    setFieldValue('reason', store.request?.reason);
    setFieldValue('detailReason', store.request?.detailReason);

    setFieldValue(
      'startDate',
      formatDate(store.request?.startDate!, false) + ' ' + getLocalTimeFromISOString(store.request?.startDate!)
    );
    setFieldValue(
      'endDate',
      formatDate(store.request?.endDate!, false) + ' ' + getLocalTimeFromISOString(store.request?.endDate!)
    );

    setFieldValue('approverId', store.request?.approver._id || store.approverAndSupervisor?.approver[0]._id);
    setFieldValue('supervisorId', store.request?.supervisor._id || store.approverAndSupervisor?.supervisor[0]._id);
    return;
  }
  setFieldValue('approverId', store.approverAndSupervisor?.approver[0]._id);
  setFieldValue('supervisorId', store.approverAndSupervisor?.supervisor[0]._id);
  setFieldValue('startDate', formatDate(new Date().toISOString(), false) + ' 08:00');
  setFieldValue('endDate', formatDate(new Date().toISOString(), false) + ' 20:00');
});

onUnmounted(() => {
  store.request = undefined;
});

const onSubmit = handleSubmit(async (values: RequestDaysOffData) => {
  const startD = createISOString(values.startDate.split('T')[0], values.startDate.split('T')[1]);
  const endD = createISOString(values.endDate.split('T')[0], values.endDate.split('T')[1]);

  const status = !requestId.value
    ? await store.createRequest({
        ...values,
        startDate: startD,
        endDate: endD,
      })
    : await store.updateRequest(requestId.value, {
        ...values,
        startDate: startD,
        endDate: endD,
      });
  if ([200, 201].includes(status)) {
    router.push('/request-days-off');
  }
});

const handleInputSelect = (value: any, field: any) => {
  setFieldValue(field, value);
};
</script>
<template>
  <div>
    <div class="flex justify-between items-center">
      <h1 class="text-xl font-medium">
        {{ requestId ? (store.request?.status === 'PENDING' ? 'Edit request' : 'View request') : 'Create new request' }}
      </h1>
      <div>
        <Badge v-if="requestId" class="h-8" :class="STATUS_STYLE[store.request?.status || '']">{{
          store.request?.status
        }}</Badge>
      </div>
    </div>

    <div class="mt-4">
      <form :onsubmit="onSubmit">
        <div class="grid grid-cols-2 gap-20">
          <FormField v-slot="{ errors, componentField, field }" name="requestTypeId">
            <SelectFormField
              :default_value="values.requestTypeId"
              :label="'Request type'"
              :component-field="componentField"
              :errors="errors"
              :list="store.requestType"
              :required="true"
              :dropdown_width="300"
              @update:select="(value:string)=>handleInputSelect(value,field.name)"
            />
          </FormField>

          <FormField v-slot="{ errors, componentField }" name="startDate">
            <DateTimeInputFormField
              :component-field="componentField"
              label="Start date"
              :errors="errors"
              :required="true"
              :min="minDate"
            />
          </FormField>
        </div>

        <div class="grid grid-cols-2 gap-20 mt-4">
          <FormField v-slot="{ componentField, errors, field }" name="reason">
            <InputWithSelectFormField
              :label="'Reason'"
              :component-field="componentField"
              :errors="errors"
              :list-value="listReasons"
              :required="true"
              @update:value="(value:string)=>handleInputSelect(value,field.name)"
            />
          </FormField>
          <FormField v-slot="{ errors, componentField }" name="endDate">
            <DateTimeInputFormField
              :component-field="componentField"
              label="End date"
              :errors="errors"
              :required="true"
              :min="values.startDate"
            />
          </FormField>
        </div>

        <div class="grid grid-cols-2 gap-20 mt-4">
          <FormField v-slot="{ componentField, errors }" name="detailReason">
            <TextareaFormField
              :label="'Reason details'"
              :component-field="componentField"
              :errors="errors"
              :required="true"
            />
          </FormField>
          <div
            v-if="store.request?.status === 'REJECTED' || store.request?.status === 'APPROVED'"
            class="flex flex-col gap-1"
          >
            <Label class="leading-none text-sm">Message</Label>
            <Textarea
              :model-value="store.request?.approver.message"
              class="focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-20 mt-4">
          <FormField v-slot="{ errors, field }" name="approverId">
            <SelectFormField
              :label="'Approver'"
              :errors="errors"
              :required="true"
              :message="true"
              :list="
                store.approverAndSupervisor?.approver.map((user) => {
                  return {
                    label: user.displayName,
                    value: user._id,
                  };
                }) || []
              "
              :default_value="store.approverAndSupervisor?.approver[0]._id"
              @update:select="(value:string)=>handleInputSelect(value,field.name)"
            />
          </FormField>
          <FormField v-slot="{ errors, field }" name="supervisorId">
            <SelectFormField
              :label="'Supervisor'"
              :errors="errors"
              :required="true"
              :message="true"
              :list="
                store.approverAndSupervisor?.supervisor.map((user) => {
                  return {
                    label: user.displayName,
                    value: user._id,
                  };
                }) || []
              "
              :default_value="store.approverAndSupervisor?.supervisor[0]._id"
              @update:select="(value:string)=>handleInputSelect(value,field.name)"
            />
          </FormField>
        </div>
        <div v-if="requestId" class="grid grid-cols-2 gap-20 mt-4">
          <div class="flex flex-col gap-2">
            <Label>Created date</Label>
            <Input
              :model-value="store.request?.createdAt ? new Date(store.request?.createdAt).toLocaleString('vi-VN') : ''"
              disabled
              class="focus-visible:ring-0 focus-visible:ring-offet-0 disabled:opacity-1"
              type="text"
            />
          </div>
          <div v-if="store.request?.status === 'APPROVED'" class="flex flex-col gap-2">
            <Label>Accept date</Label>
            <Input
              :model-value="
                store.request?.approver.acceptAt
                  ? new Date(store.request?.approver.acceptAt).toLocaleString('vi-VN')
                  : ''
              "
              disabled
              class="focus-visible:ring-0 focus-visible:ring-offet-0 disabled:opacity-1"
              type="text"
            />
          </div>
          <div v-if="store.request?.status === 'REJECTED'" class="flex flex-col gap-2">
            <Label>Reject date</Label>
            <Input
              :model-value="
                store.request?.approver.rejectAt
                  ? new Date(store.request?.approver.rejectAt).toLocaleString('vi-VN')
                  : ''
              "
              disabled
              class="focus-visible:ring-0 focus-visible:ring-offet-0 disabled:opacity-1"
              type="text"
            />
          </div>
        </div>
        <div v-if="!requestId || store.request?.status === 'PENDING'" class="mt-4 text-end flex gap-2 justify-end">
          <Button type="submit">{{ requestId ? 'Save' : 'Create' }}</Button>
          <Button v-if="requestId" type="button" variant="outline">Cancel Request</Button>
        </div>
      </form>
    </div>
  </div>
</template>
