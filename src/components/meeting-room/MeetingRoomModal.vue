<script setup lang="ts">
import InputFormField from '@/components/base/InputFormField.vue';
import SelectFormField from '@/components/base/SelectFormField.vue';
import TextareaFormField from '@/components/base/TextareaFormField.vue';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form';
import { MeetingRoomStatus } from '@/constants/meeting-room.constant';
import { meetingRoomSchema } from '@/components/meeting-room/schema';
import { useModalStore } from '@/stores';
import { useMeetingRoomStore } from '@/stores/meeting-room.store';
import { MeetingRoom } from '@/types/meeting-room.type';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { watch } from 'vue';

const modalStore = useModalStore();
const meetingRoomStore = useMeetingRoomStore();

const formSchema = toTypedSchema(meetingRoomSchema);

const { values, setFieldValue, handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  const status = modalStore.data
    ? await meetingRoomStore.updateMeetingRoom(modalStore.data._id as string, values)
    : await meetingRoomStore.createMeetingRoom(values);
  if ([200, 201].includes(status)) {
    modalStore.isOpen = false;
    modalStore.data = undefined;
  }
});

watch(
  () => modalStore.isOpen,
  (open) => {
    if (open && modalStore.data) {
      const data = modalStore.data as MeetingRoom;
      const keys = Object.keys(data) as Array<keyof typeof data>;
      keys.forEach((key) => {
        // @ts-ignore
        setFieldValue(key, data[key] as string);
      });
      return;
    }
  }
);

const handleOpen = (open: boolean) => {
  if (!open) {
    modalStore.isOpen = open;
    modalStore.data = undefined;
    return;
  }
};

const handleSelectField = (field: any, value: any) => {
  setFieldValue(field, value);
};
</script>

<template>
  <Dialog :open="modalStore.isOpen" @update:open="handleOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ modalStore.data ? 'Edit Room' : 'Add New Meeting Room' }}</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <form id="form" @submit="onSubmit" class="flex flex-col gap-2">
        <FormField v-slot="{ componentField, errors }" name="name">
          <InputFormField label="Name" :component-field="componentField" :errors="errors" :required="true" />
        </FormField>
        <FormField v-slot="{ componentField, errors }" name="location">
          <InputFormField label="Location" :component-field="componentField" :errors="errors" :required="true" />
        </FormField>
        <FormField v-slot="{ componentField, errors }" name="description">
          <TextareaFormField label="Description" :component-field="componentField" :errors="errors" :required="true" />
        </FormField>
        <FormField v-slot="{ componentField, errors }" name="seating">
          <InputFormField
            label="Seating"
            :component-field="componentField"
            :errors="errors"
            :required="true"
            type="number"
          />
        </FormField>
        <FormField v-slot="{ componentField, errors }" name="image_url">
          <InputFormField label="Image" :component-field="componentField" :errors="errors" />
          <div v-if="values.image_url" class="w-40 h-20 overflow-hidden rounded">
            <img :src="values.image_url" alt="" class="w-full h-full" />
          </div>
        </FormField>
        <FormField v-if="modalStore.data" v-slot="{ componentField, errors, field }" name="status">
          <SelectFormField
            :default_value="values.status"
            label="Status"
            :component-field="componentField"
            :errors="errors"
            :required="true"
            :list="
              Object.values(MeetingRoomStatus).map((item) => {
                return { label: item, value: item };
              })
            "
            @update:select="(value:string)=>handleSelectField(field.name,value)"
          />
        </FormField>
      </form>
      <DialogFooter>
        <Button form="form" type="submit"> Save </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
