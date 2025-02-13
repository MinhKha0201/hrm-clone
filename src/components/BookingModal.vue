<script setup lang="ts">
import CalendarFormField from '@/components/base/CalendarFormField.vue';
import InputFormField from '@/components/base/InputFormField.vue';
import MultipleSelectFormField from '@/components/base/MultipleSelectFormField.vue';
import SelectFormField from '@/components/base/SelectFormField.vue';
import TimeInputFormField from '@/components/base/TimeInputFormField.vue';
import { BookARoomSchema } from '@/components/dashboard/schema';
import Badge from '@/components/ui/badge/Badge.vue';
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createISOString } from '@/helper';
import { useDepartmentStore, useGroupStore, useMeetingScheduleStore, useUserStore } from '@/stores';
import { useMeetingRoomStore } from '@/stores/meeting-room.store';
import { ComboboxFilterType } from '@/types';
import { toTypedSchema } from '@vee-validate/zod';
import { Plus, X } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { computed, onMounted, onUpdated, ref } from 'vue';
import DialogTrigger from './ui/dialog/DialogTrigger.vue';
import Input from './ui/input/Input.vue';
import Label from './ui/label/Label.vue';
import ConfirmAlert from './base/ConfirmAlert.vue';

interface Prop {
  modelValue: boolean;
  date: string;
  start_time: string;
  end_time: string;
  room?: string;
  location?: string;
  type: 'user' | 'room';
}

const props = defineProps<Prop>();

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void;
}>();

const userStore = useUserStore();
const meetingRoomStore = useMeetingRoomStore();
const departmentStore = useDepartmentStore();
const meetingScheduleStore = useMeetingScheduleStore();
const groupStore = useGroupStore();

const formSchema = toTypedSchema(BookARoomSchema);

const { setFieldValue, values, handleSubmit, handleReset } = useForm({
  validationSchema: formSchema,
});

const listRoomCombobox = ref<ComboboxFilterType[]>([]);
const listLocationCombobox = ref<ComboboxFilterType[]>([]);
const listDepartmentCombobox = ref<ComboboxFilterType[]>([]);
const datePlaceholder = ref();
const target = ref('department');
const groupName = ref('');
const isOpenDialog = ref(false);

const dateValue = computed(() => values.date);
const listGroupCombobox = computed<ComboboxFilterType[]>(() =>
  groupStore.groups.map((group) => {
    return {
      label: group.name,
      value: group._id,
    };
  })
);
const showAddButton = computed(() => {
  return (
    values.attendee_ids &&
    values.attendee_ids.length > 2 &&
    groupStore.groups.some((group) => {
      const groupMemberIds = group.members.map((member) => member._id);
      return (
        groupMemberIds.length === values.attendee_ids?.length &&
        new Set(groupMemberIds).size === new Set([...groupMemberIds, ...values.attendee_ids]).size
      );
    })
  );
});

const onSubmit = handleSubmit(async (values) => {
  const startD = createISOString(values.date, values.start_time);
  const endD = createISOString(values.date, values.end_time);
  const status = await meetingRoomStore.createBooking({ ...values, startDate: startD, endDate: endD });
  if ([200, 201].includes(status)) {
    emit('update:open', false);
    meetingScheduleStore.getMeetingScheduleList();
  }
});

const handleSetValue = async (field: any, value: any) => {
  setFieldValue(field, value);
};

const handleSelectDepartment = (field: any, value: string) => {
  setFieldValue('attendee_ids', []);
  departmentStore.getDepartmentByID(value);
  setFieldValue(field, value);
  setFieldValue(
    'attendee_ids',
    values.attendee_ids
      ? values.attendee_ids.concat(departmentStore.department?.members || [])
      : departmentStore.department?.members
  );
};

const handleSelectGroup = (field: any, value: string) => {
  setFieldValue('attendee_ids', []);
  const group = groupStore.groups.find((group) => group._id === value);
  setFieldValue(field, value);
  if (group) {
    setFieldValue(
      'attendee_ids',
      values.attendee_ids
        ? values.attendee_ids.concat(group.members.map((member) => member._id))
        : group.members.map((member) => member._id)
    );
  }
};

const handleSelectTarget = (value: string) => {
  target.value = value;
};

const handleOpen = (value: boolean) => {
  emit('update:open', value);
  meetingScheduleStore.getMeetingScheduleList();
};

onMounted(async () => {
  if (userStore.users.length === 0) await userStore.getAllUser();
  if (meetingRoomStore.meetingRooms.length === 0) await meetingRoomStore.getAllMeetingRoom();
  if (departmentStore.departments.length === 0) await departmentStore.getDepartments();
  if (groupStore.groups.length === 0) await groupStore.getAllGroup();

  listRoomCombobox.value = meetingRoomStore.meetingRooms.map((room) => {
    return {
      label: room.name,
      value: room._id,
    };
  });

  listDepartmentCombobox.value = departmentStore.departments.map((department) => {
    return {
      label: department.name,
      value: department._id,
    };
  });

  listLocationCombobox.value = meetingRoomStore.meetingRooms.reduce((acc, item) => {
    if (!acc.some((obj) => obj.value === item.location)) {
      acc.push({
        label: item.location,
        value: item.location,
      });
    }
    return acc;
  }, [] as ComboboxFilterType[]);
});

onUpdated(() => {
  if (props.modelValue) {
    setFieldValue('date', props.date);
    setFieldValue('start_time', props.start_time);
    setFieldValue('end_time', props.end_time);
    setFieldValue('roomId', props.room);
    setFieldValue('location', props.location);
  }
});

const handleSelectLocation = (value: string) => {
  setFieldValue('location', value);
  listRoomCombobox.value = meetingRoomStore.meetingRooms
    .filter((room) => room.location === value)
    .map((room) => {
      return {
        label: room.name,
        value: room._id,
      };
    });
};

const handleSelectRoom = (value: string) => {
  const room = meetingRoomStore.meetingRooms.find((room) => room._id === value);
  if (room) {
    setFieldValue('roomId', value);
    setFieldValue('location', room.location);
  }
};

const handleCreateGroup = async () => {
  if (values.attendee_ids && values.attendee_ids.length > 2 && groupName.value.length > 0) {
    const status = await groupStore.createGroup({ name: groupName.value, member_ids: values.attendee_ids || [] });
    if (status === 201) {
      isOpenDialog.value = false;
    }
  }
};

const handleOpenDialog = (open: boolean) => {
  isOpenDialog.value = open;
};

const handleDeleteUser = (id: string) => {
  const newUserList = values.attendee_ids?.filter((item) => item !== id);
  setFieldValue('attendee_ids', newUserList);
};

const handleUpdateGroup = async () => {
  if (values.group) await groupStore.updateGroup(values.group, { member_ids: values.attendee_ids });
};
</script>

<template>
  <Dialog :open="modelValue" @update:open="handleOpen">
    <DialogContent class="sm:max-w-[725px]">
      <DialogHeader>
        <DialogTitle>Booking room</DialogTitle>
        <DialogDescription> </DialogDescription>
      </DialogHeader>
      <form id="bookingForm" class="" @submit="onSubmit">
        <div class="col-span-2">
          <div class="flex flex-col gap-2 p-4">
            <div class="grid grid-cols-1 gap-2">
              <div class="col-span-2">
                <FormField v-slot="{ errors, field }" name="date">
                  <CalendarFormField
                    :errors="errors"
                    :label="'Date'"
                    :placeholder="datePlaceholder"
                    :required="true"
                    :value="dateValue"
                    @update:pick="(value) => handleSetValue(field.name, value)"
                  />
                </FormField>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <FormField v-slot="{ errors, componentField }" name="start_time">
                <TimeInputFormField
                  :errors="errors"
                  :label="'Start time'"
                  :required="true"
                  :component-field="componentField"
                />
              </FormField>
              <FormField v-slot="{ errors, componentField }" name="end_time">
                <TimeInputFormField
                  :errors="errors"
                  :label="'End time'"
                  :required="true"
                  :component-field="componentField"
                  type="time"
                />
              </FormField>
            </div>
            <FormField v-slot="{ errors }" name="location">
              <SelectFormField
                :disabled="type === 'room'"
                :default_value="values.location"
                :errors="errors"
                :label="'Location'"
                :required="true"
                :list="listLocationCombobox"
                :dropdown_width="300"
                @update:select="handleSelectLocation"
              />
            </FormField>
            <FormField v-slot="{ errors }" name="roomId">
              <SelectFormField
                :disabled="type === 'room'"
                :default_value="values.roomId"
                :errors="errors"
                :label="'Room'"
                :required="true"
                :list="listRoomCombobox"
                :dropdown_width="300"
                @update:select="handleSelectRoom"
              />
            </FormField>
            <FormField v-slot="{ componentField, errors, field }" name="meetingLink">
              <InputFormField
                :component-field="componentField"
                :errors="errors"
                :label="'Meeting link'"
                :message="true"
              />
            </FormField>
            <FormField v-slot="{ componentField, errors, field }" name="meetingAgenda">
              <InputFormField
                :component-field="componentField"
                :errors="errors"
                :label="'Meeting title'"
                :required="true"
                :message="true"
              />
            </FormField>
            <div class="flex gap-2">
              <FormField v-slot="{ errors, field }" name="attendee_ids">
                <MultipleSelectFormField
                  :default_value="values.attendee_ids"
                  :errors="errors"
                  :label="'Members'"
                  :list="
                    userStore.users.map((user) => {
                      return { label: user.displayName, value: user._id };
                    })
                  "
                  :required="true"
                  class="flex-1"
                  @update:select="(value) => handleSetValue(field.name, value)"
                />
              </FormField>
              <div class="flex gap-3 flex-col">
                <Label>Target</Label>
                <Select :model-value="target" @update:model-value="handleSelectTarget">
                  <SelectTrigger class="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="department"> Department </SelectItem>
                      <SelectItem value="group"> Group </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <FormField v-if="target === 'department'" v-slot="{ errors, field }" name="department">
                <SelectFormField
                  :default_value="values.department"
                  :errors="errors"
                  :label="'Department'"
                  :list="listDepartmentCombobox"
                  class="flex-1"
                  @update:select="(value) => handleSelectDepartment(field.name, value)"
                />
              </FormField>
              <FormField v-else v-slot="{ errors, field }" name="group">
                <SelectFormField
                  :errors="errors"
                  :label="'Group'"
                  :list="listGroupCombobox"
                  class="flex-1"
                  @update:select="(value) => handleSelectGroup(field.name, value)"
                />
              </FormField>
            </div>
            <div class="flex flex-wrap gap-1">
              <Badge
                v-for="(item, index) in values.attendee_ids?.slice(0, 10)"
                :key="index"
                class="bg-gray-100 text-black hover:bg-gray-100 flex items-center gap-2"
                >{{ userStore.users.find((user) => user._id === item)?.displayName }}
                <button type="button"><X :size="16" @click="handleDeleteUser(item)" /></button
              ></Badge>
              <Badge
                v-if="values.attendee_ids && values.attendee_ids.length > 10"
                class="bg-gray-100 text-black hover:bg-gray-100"
                >{{ values.attendee_ids?.length! - 10 + '+' }}</Badge
              >
            </div>
            <Dialog v-if="!values.group && !showAddButton" :open="isOpenDialog" @update:open="handleOpenDialog">
              <DialogTrigger as-child>
                <Button
                  v-if="values.attendee_ids && values.attendee_ids?.length > 1"
                  type="button"
                  variant="outline"
                  class="w-fit h-fit text-xs py-1 px-2 rounded-xl gap-2"
                  ><Plus :size="12" />Add new group</Button
                >
              </DialogTrigger>
              <DialogContent class="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add new group</DialogTitle>
                  <DialogDescription> </DialogDescription>
                </DialogHeader>
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for="name" class="text-right"> Group Name </Label>
                  <Input id="name" v-model="groupName" class="col-span-3" />
                </div>
                <DialogFooter>
                  <Button type="button" @click="handleCreateGroup"> Add </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <ConfirmAlert
              type="warning"
              v-if="values.group && !showAddButton && values.attendee_ids && values.attendee_ids.length > 2"
              @click="handleUpdateGroup"
            >
              <Button type="button" variant="outline" class="w-fit h-fit text-xs py-1 px-2 rounded-xl gap-2"
                ><Plus :size="12" />Update group</Button
              >
            </ConfirmAlert>
          </div>
        </div>
      </form>
      <DialogFooter>
        <Button form="bookingForm" type="submit"> Book </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
