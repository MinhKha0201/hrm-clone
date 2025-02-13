<script lang="ts" setup>
import ConfirmAlert from '@/components/base/ConfirmAlert.vue';
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';
import Textarea from '@/components/ui/textarea/Textarea.vue';
import { getLocalTimeFromISOString } from '@/helper';
import { formatDate } from '@/lib/utils';
import router from '@/router';
import { useRequestDaysOffStore } from '@/stores';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const store = useRequestDaysOffStore();

const id = computed(() => route.params.id as string);
const request = computed(() => store.request);

onMounted(async () => {
  await store.getRequest(id.value);
});

const handleApprove = async (message: string) => {
  const status = await store.approveRequest(id.value, message);
  if (status === 200) {
    router.push('/list-request');
  }
};

const handleReject = async (rejectReason: string) => {
  const status = await store.rejectRequest(id.value, rejectReason);
  if (status === 200) {
    router.push('/list-request');
  }
};
</script>
<template>
  <div>
    <h1 class="text-xl font-normal">Request details</h1>
    <div class="mt-4">
      <div class="grid grid-cols-2 gap-20 mt-4">
        <div class="flex flex-col gap-2">
          <Label>Creator</Label>
          <Input
            disabled
            class="focus-visible:ring-0 focus-visible:ring-offet-0 disabled:opacity-1"
            type="text"
            :model-value="request?.creator.displayName"
          />
        </div>

        <div class="flex flex-col gap-2">
          <Label>Supervisor</Label>
          <Input
            disabled
            class="focus-visible:ring-0 focus-visible:ring-offet-0 disabled:opacity-1"
            type="text"
            :model-value="request?.supervisor.displayName"
          />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-20 mt-4">
        <div class="flex flex-col gap-2">
          <Label>Request type</Label>
          <Input
            disabled
            class="focus-visible:ring-0 focus-visible:ring-offet-0 disabled:opacity-1"
            type="text"
            :model-value="request?.requestType.name"
          />
        </div>

        <div class="grid grid-cols-4 gap-2">
          <div class="flex flex-col gap-2 col-span-3">
            <Label>Start date</Label>
            <Input
              :model-value="formatDate(store.request?.startDate!, false)"
              disabled
              class="focus-visible:ring-0 focus-visible:ring-offet-0 disabled:opacity-1"
              type="text"
            />
          </div>
          <div class="flex flex-col gap-2">
            <Label>Start time</Label>
            <Input
              :model-value="getLocalTimeFromISOString(store.request?.startDate!)"
              disabled
              class="focus-visible:ring-0 focus-visible:ring-offet-0 disabled:opacity-1"
              type="text"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-20 mt-4">
        <div class="flex flex-col gap-2">
          <Label>Reason</Label>
          <Input
            :model-value="request?.reason"
            disabled
            class="focus-visible:ring-0 focus-visible:ring-offet-0 disabled:opacity-1"
            type="text"
          />
        </div>

        <div class="grid grid-cols-4 gap-2">
          <div class="flex flex-col gap-2 col-span-3">
            <Label>End date</Label>
            <Input
              :model-value="formatDate(store.request?.endDate!, false)"
              disabled
              class="focus-visible:ring-0 focus-visible:ring-offet-0 disabled:opacity-1"
              type="text"
            />
          </div>
          <div class="flex flex-col gap-2">
            <Label>End time</Label>
            <Input
              :model-value="getLocalTimeFromISOString(store.request?.endDate!)"
              disabled
              class="focus-visible:ring-0 focus-visible:ring-offet-0 disabled:opacity-1"
              type="text"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-20 mt-4">
        <div class="flex flex-col gap-2">
          <Label>Reason detail</Label>
          <Textarea
            :model-value="request?.detailReason"
            disabled
            class="focus-visible:ring-0 focus-visible:ring-offet-0 disabled:opacity-1"
            type="text"
          />
        </div>
        <div class="flex flex-col gap-2">
          <Label>Message</Label>
          <Textarea
            :model-value="request?.approver.message || ''"
            disabled
            class="focus-visible:ring-0 focus-visible:ring-offet-0 disabled:opacity-1"
            type="text"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-20 mt-4">
        <div class="flex flex-col gap-2">
          <Label>Created date</Label>
          <Input
            :model-value="store.request?.createdAt ? new Date(store.request?.createdAt).toLocaleString('vi-VN') : ''"
            disabled
            class="focus-visible:ring-0 focus-visible:ring-offet-0 disabled:opacity-1"
            type="text"
          />
        </div>
        <div class="flex flex-col gap-2">
          <Label>Accept date</Label>
          <Input
            :model-value="
              store.request?.approver.acceptAt ? new Date(store.request?.approver.acceptAt).toLocaleString('vi-VN') : ''
            "
            disabled
            class="focus-visible:ring-0 focus-visible:ring-offet-0 disabled:opacity-1"
            type="text"
          />
        </div>
      </div>
    </div>
    <div v-if="request?.status === 'PENDING'" class="mt-4 flex justify-end gap-2">
      <ConfirmAlert type="success" button_content="Approve" :reason="true" @click="handleApprove">
        <Button @click="handleApprove" class="text-white bg-green-500 hover:bg-green-500">Approve</Button>
      </ConfirmAlert>
      <ConfirmAlert type="error" button_content="Reject" :reason="true" @click="handleReject">
        <Button class="text-white bg-red-500 hover:bg-red-500">Reject</Button>
      </ConfirmAlert>
    </div>
  </div>
</template>
