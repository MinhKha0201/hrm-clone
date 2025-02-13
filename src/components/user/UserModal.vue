<script setup lang="ts">
import InputFormField from '@/components/base/InputFormField.vue';
import SelectFormField from '@/components/base/SelectFormField.vue';
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
import { useModalStore, useRoleStore, useUserStore } from '@/stores';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { computed, watch } from 'vue';
import { User } from '@/types';
import { userSchema } from '@/components/user/schema';

const modalStore = useModalStore();
const roleStore = useRoleStore();
const userStore = useUserStore();

const formSchema = toTypedSchema(userSchema);
const { handleSubmit, setFieldValue, values } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  const status = !modalStore.data
    ? await userStore.addUser(values)
    : await userStore.updateUser(modalStore.data._id, values);
  if ([200, 201].includes(status)) {
    modalStore.isOpen = false;
  }
});

const genders = [
  {
    value: '1',
    label: 'Male',
  },
  {
    value: '0',
    label: 'Female',
  },
];

const listRole = computed(() =>
  roleStore.roles.map((role) => {
    return {
      label: role.name,
      value: role._id,
    };
  })
);

watch(
  () => modalStore.isOpen,
  async (open) => {
    if (roleStore.roles.length === 0) await roleStore.getRoles();
    if (modalStore.data) {
      const data = modalStore.data as User;
      const keys = Object.keys(data) as Array<keyof typeof data>;
      keys.forEach((key) => {
        if (key !== '_id') {
          // @ts-ignore
          setFieldValue(key, data[key]);
        }
        if (key === 'role') {
          setFieldValue('roleId', data.role._id);
        }
      });
    }
  }
);
const handleOpen = (open: boolean) => {
  if (!open) {
    modalStore.isOpen = false;
    modalStore.data = undefined;
  }
};

const handleSelectGender = (field: any, value: string) => {
  if (field === 'gender') {
    setFieldValue(field, Number(value));
    return;
  }
  setFieldValue(field, value);
};
</script>

<template>
  <Dialog :open="modalStore.isOpen" @update:open="handleOpen">
    <DialogContent class="sm:max-w-[525px]">
      <DialogHeader>
        <DialogTitle>{{ modalStore.data ? 'Edit user' : 'Add user' }}</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <form id="form" @submit="onSubmit" class="flex flex-col gap-2">
        <FormField v-slot="{ componentField, errors }" name="displayName">
          <InputFormField
            :component-field="componentField"
            :errors="errors"
            :required="true"
            label="Display name"
            type="text"
            :message="true"
          />
        </FormField>
        <FormField v-slot="{ componentField, errors }" name="email">
          <InputFormField
            :component-field="componentField"
            :errors="errors"
            :required="true"
            label="Email"
            type="email"
            :message="true"
          />
        </FormField>
        <FormField v-slot="{ componentField, errors }" name="password">
          <InputFormField
            :component-field="componentField"
            :errors="errors"
            :required="true"
            label="Password"
            type="password"
            :message="true"
          />
        </FormField>
        <FormField v-slot="{ errors, field }" name="gender">
          <SelectFormField
            :errors="errors"
            label="Gender"
            :message="true"
            :list="genders"
            @update:select="(value:string)=>handleSelectGender(field.name,value)"
            class="w-full"
            :default_value="typeof values.gender === 'number' ? String(values.gender) : undefined"
          />
        </FormField>
        <FormField v-slot="{ errors, field }" name="roleId">
          <SelectFormField
            :errors="errors"
            :required="true"
            label="Role"
            :message="true"
            @update:select="(value:string)=>handleSelectGender(field.name,value)"
            class="w-full"
            :list="listRole"
            :default_value="values.roleId"
          />
        </FormField>
      </form>
      <DialogFooter>
        <Button form="form" type="submit"> Save </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
