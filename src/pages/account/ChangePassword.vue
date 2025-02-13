<script lang="ts" setup>
import Button from '@/components/ui/button/Button.vue';
import { FormField } from '@/components/ui/form';
import FormControl from '@/components/ui/form/FormControl.vue';
import FormItem from '@/components/ui/form/FormItem.vue';
import FormLabel from '@/components/ui/form/FormLabel.vue';
import FormMessage from '@/components/ui/form/FormMessage.vue';
import Input from '@/components/ui/input/Input.vue';
import { useAuthStore } from '@/stores';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import * as z from 'zod';
import { ZUtils } from '@/lib/validation.utils.ts';

const formSchema = toTypedSchema(
  z
    .object({
      old_password: ZUtils.password(),
      new_password: ZUtils.password(),
      confirm_new_password: ZUtils.password(),
    })
    .refine((data: any) => data.new_password === data.confirm_new_password, {
      message: "Passwords don't match.",
      path: ['confirm_new_password'],
    })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
});

const authStore = useAuthStore();

const onSubmit = handleSubmit(async (values) => {
  const status = await authStore.changePassword(values);
  if (status === 204) {
    resetForm({
      values: {
        confirm_new_password: '',
        new_password: '',
        old_password: '',
      },
    });
  }
});
</script>
<template>
  <div class="px-5">
    <h1 class="text-xl mb-6">Change password</h1>
    <form class="w-full sm:w-1/2" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="old_password">
        <FormItem>
          <FormLabel>Old password</FormLabel>
          <FormControl>
            <Input id="old_password" type="password" class="" v-bind="componentField" :autocomplete="false" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="new_password">
        <FormItem>
          <FormLabel>New password</FormLabel>
          <FormControl>
            <Input id="new_password" type="password" class="" v-bind="componentField" :autocomplete="false" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="confirm_new_password">
        <FormItem>
          <FormLabel>Confirm password</FormLabel>
          <FormControl>
            <Input id="confirm_new_password" type="password" class="" v-bind="componentField" :autocomplete="false" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button type="submit" class="mt-2"> Save</Button>
    </form>
  </div>
</template>
