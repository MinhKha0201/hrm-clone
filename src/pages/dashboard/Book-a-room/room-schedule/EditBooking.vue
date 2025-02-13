<script lang="ts" setup>
import CalendarFormField from '@/components/base/CalendarFormField.vue';
import ConfirmAlert from '@/components/base/ConfirmAlert.vue';
import InputFormField from '@/components/base/InputFormField.vue';
import MultipleSelectFormField from '@/components/base/MultipleSelectFormField.vue';
import SelectFormField from '@/components/base/SelectFormField.vue';
import TimeInputFormField from '@/components/base/TimeInputFormField.vue';
import { BookARoomSchema } from '@/components/dashboard/schema';
import Badge from '@/components/ui/badge/Badge.vue';
import Button from '@/components/ui/button/Button.vue';
import Dialog from '@/components/ui/dialog/Dialog.vue';
import DialogContent from '@/components/ui/dialog/DialogContent.vue';
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue';
import DialogFooter from '@/components/ui/dialog/DialogFooter.vue';
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue';
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue';
import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue';
import { FormField } from '@/components/ui/form';
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';
import Select from '@/components/ui/select/Select.vue';
import SelectContent from '@/components/ui/select/SelectContent.vue';
import SelectGroup from '@/components/ui/select/SelectGroup.vue';
import SelectItem from '@/components/ui/select/SelectItem.vue';
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue';
import SelectValue from '@/components/ui/select/SelectValue.vue';
import { createISOString, getLocalTime, getLocalTimeFromISOString } from '@/helper';
import { formatDate } from '@/lib/utils';
import router from '@/router';
import { useDepartmentStore, useGroupStore, useMeetingScheduleStore, useUserStore } from '@/stores';
import { useMeetingRoomStore } from '@/stores/meeting-room.store';
import { ComboboxFilterType } from '@/types';
import { toTypedSchema } from '@vee-validate/zod';
import { Plus, X } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { computed, onMounted, ref } from 'vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import { useRoute } from 'vue-router';

const route = useRoute();
const userStore = useUserStore();
const meetingRoomStore = useMeetingRoomStore();
const departmentStore = useDepartmentStore();
const meetingScheduleStore = useMeetingScheduleStore();
const groupStore = useGroupStore();

const formSchema = toTypedSchema(BookARoomSchema);

const { setFieldValue, values, handleSubmit, handleReset } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  const startD = createISOString(values.date, values.start_time);
  const endD = createISOString(values.date, values.end_time);
  const status = await meetingRoomStore.updateBooking(id.value, {
    startDate: startD,
    endDate: endD,
    meetingAgenda: values.meetingAgenda,
    attendee_ids: values.attendee_ids,
    meetingLink: values.meetingLink,
  });
  if (status === 200) {
    router.push(`/book-a-room/room-schedule/${meetingRoomStore.bookingRoom?.room._id}`);
  }
});

const listRoomCombobox = ref<ComboboxFilterType[]>([]);
const listLocationCombobox = ref<ComboboxFilterType[]>([]);
const listDepartmentCombobox = ref<ComboboxFilterType[]>([]);
const datePlaceholder = ref();
const target = ref('department');
const groupName = ref('');
const isOpenDialog = ref(false);

const id = computed(() => route.params.id as string);
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

const handleSetValue = async (field: any, value: any) => {
  setFieldValue(field, value);
};

const handleSelectTarget = (value: string) => {
  target.value = value;
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

onMounted(async () => {
  if (userStore.users.length === 0) await userStore.getAllUser();
  if (meetingRoomStore.meetingRooms.length === 0) await meetingRoomStore.getAllMeetingRoom();
  if (departmentStore.departments.length === 0) await departmentStore.getDepartments();
  if (groupStore.groups.length === 0) await groupStore.getAllGroup();
  if (!meetingRoomStore.bookingRoom) await meetingRoomStore.getBookingRoom(id.value);
  if (meetingScheduleStore.meetingSchedule.length === 0)
    await meetingScheduleStore.getScheduleByRoom(
      meetingRoomStore.bookingRoom?.room._id!,
      meetingRoomStore.bookingRoom?.startDate!,
      meetingRoomStore.bookingRoom?.startDate!
    );

  if (!meetingRoomStore.bookingRoom?.department) {
    target.value = 'group';
  }

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

  const mainEvent = meetingScheduleStore.meetingSchedule.find((event) => event.id === id.value);
  if (mainEvent) {
    mainEvent.class = 'bg-blue-500 !text-black hover:cursor-pointer';
  }

  setFieldValue('date', formatDate(meetingRoomStore.bookingRoom?.startDate!, false));
  setFieldValue('start_time', getLocalTime(meetingRoomStore.bookingRoom?.startDate!));
  setFieldValue('end_time', getLocalTime(meetingRoomStore.bookingRoom?.endDate!));
  setFieldValue('roomId', meetingRoomStore.bookingRoom?.room._id);
  setFieldValue('location', meetingRoomStore.bookingRoom?.room.location);
  setFieldValue('meetingAgenda', meetingRoomStore.bookingRoom?.meetingAgenda);
  setFieldValue('attendee_ids', meetingRoomStore.bookingRoom?.attendees.map((user) => user._id) || []);
  setFieldValue('group', meetingRoomStore.bookingRoom?.group._id);
});

const handleChangeDuration = (payload: any) => {
  setFieldValue('start_time', getLocalTimeFromISOString(payload.event.start));
  setFieldValue('end_time', getLocalTimeFromISOString(payload.event.end));
};
</script>
<template>
  <div class="grid grid-cols-3 gap-4">
    <div>
      <form @submit="onSubmit">
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
                :default_value="values.location"
                :errors="errors"
                :label="'Location'"
                :required="true"
                :disabled="true"
                :list="listLocationCombobox"
                :dropdown_width="300"
                @update:select="handleSelectLocation"
              />
            </FormField>
            <FormField v-slot="{ errors }" name="roomId">
              <SelectFormField
                :default_value="values.roomId"
                :errors="errors"
                :label="'Room'"
                :required="true"
                :disabled="true"
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
            <div class="flex flex-col gap-2">
              <div class="flex gap-3 flex-col">
                <Label>Target</Label>
                <Select :model-value="target" @update:model-value="handleSelectTarget">
                  <SelectTrigger class="w-full">
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
                  :default_value="values.group"
                  :errors="errors"
                  :label="'Group'"
                  :list="listGroupCombobox"
                  class="flex-1"
                  @update:select="(value) => handleSelectGroup(field.name, value)"
                />
              </FormField>
            </div>
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
            </div>
            <div class="flex flex-wrap gap-1">
              <Badge
                v-for="(item, index) in values.attendee_ids?.slice(0, 5)"
                :key="index"
                class="bg-gray-100 text-black hover:bg-gray-100 flex items-center gap-2"
                >{{ userStore.users.find((user) => user._id === item)?.displayName }}
                <button type="button"><X :size="16" @click="handleDeleteUser(item)" /></button
              ></Badge>
              <Badge
                v-if="values.attendee_ids && values.attendee_ids.length > 5"
                class="bg-gray-100 text-black hover:bg-gray-100"
                >{{ values.attendee_ids?.length! - 5 + '+' }}</Badge
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
            <div class="flex justify-end">
              <Button>Save</Button>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="col-span-2">
      <vue-cal
        :selected-date="formatDate(meetingRoomStore.bookingRoom?.startDate!, false)"
        :disable-views="['years', 'year', 'month', 'week']"
        :time-from="8 * 60"
        :time-to="19 * 60"
        :time-step="30"
        :snap-to-time="15"
        :events="meetingScheduleStore.meetingSchedule"
        class="!h-fit border-gray-200 rounded overflow-hidden mr-2.5"
        :editable-events="{ title: false, drag: true, resize: true, delete: true, create: false }"
        @event-duration-change="handleChangeDuration"
        @event-drop="handleChangeDuration"
      />
    </div>
  </div>
</template>
<style>
.vuecal__menu,
.vuecal__cell-events-count {
  background-color: #42b983;
  color: white;
}
.vuecal__title-bar {
  background-color: #e4f5ef;
  color: black;
  font-size: 18px;
}
.vuecal__cell--today,
.vuecal__cell--current {
  background-color: rgba(240, 240, 255, 0.4);
}
.vuecal:not(.vuecal--day-view) .vuecal__cell--selected {
  background-color: rgba(235, 255, 245, 0.4);
}
.vuecal__cell--selected:before {
  border-color: rgba(66, 185, 131, 0.5);
}
.vuecal__no-event {
  display: none !important;
}
.vuecal--full-height-delete {
  height: 100px;
}

.vuecal__event {
  background-color: rgba(76, 172, 175, 0.35);
}
.owner {
  background-color: #bbf7d0 !important;
  border-color: #86efac;
  border-width: 2px;
  border-radius: 4px;
}

.not-owner {
  background-color: #bfdbfe !important;
  border-color: #93c5fd;
  border-width: 2px;
  border-radius: 4px;
}
.red {
  background-color: #fecaca;
  border-color: #fca5a5;
  border-width: 2px;
  border-radius: 4px;
}
.blue {
  background-color: #bfdbfe;
  border-color: #93c5fd;
  border-width: 2px;
  border-radius: 4px;
}
.green {
  background-color: #bbf7d0;
  border-color: #86efac;
  border-width: 2px;
  border-radius: 4px;
}
.yellow {
  background-color: #fef08a;
  border-color: #fde047;
  border-width: 2px;
  border-radius: 4px;
}
.purple {
  background-color: #e9d5ff;
  border-color: #d8b4fe;
  border-width: 2px;
  border-radius: 4px;
}
.pink {
  background-color: #fbcfe8;
  border-color: #f9a8d4;
  border-width: 2px;
  border-radius: 4px;
}
.teal {
  background-color: #99f6e4;
  border-color: #5eead4;
  border-width: 2px;
  border-radius: 4px;
}
.cyan {
  background-color: #a5f3fc;
  border-color: #67e8f9;
  border-width: 2px;
  border-radius: 4px;
}
.lime {
  background-color: #d9f99d;
  border-color: #bef264;
  border-width: 2px;
  border-radius: 4px;
}
.amber {
  background-color: #fde68a;
  border-color: #fcd34d;
  border-width: 2px;
  border-radius: 4px;
}
.orange {
  background-color: #fed7aa;
  border-color: #fdba74;
  border-width: 2px;
  border-radius: 4px;
}
.indigo {
  background-color: #c7d2fe;
  border-color: #a5b4fc;
  border-width: 2px;
  border-radius: 4px;
}
.emerald {
  background-color: #a7f3d0;
  border-color: #6ee7b7;
  border-width: 2px;
  border-radius: 4px;
}
.violet {
  background-color: #ddd6fe;
  border-color: #c4b5fd;
  border-width: 2px;
  border-radius: 4px;
}
.rose {
  background-color: #fecdd3;
  border-color: #fda4af;
  border-width: 2px;
  border-radius: 4px;
}
</style>
