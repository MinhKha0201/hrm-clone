<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'vee-validate';
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { useAuthStore } from '@/stores';
import { ZUtils } from '@/lib/validation.utils.ts';

const formSchema = toTypedSchema(
  z.object({
    email: ZUtils.email(),
    password: ZUtils.password(),
  })
);

const authStore = useAuthStore();

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  await authStore.login(values);
});
</script>
<template>
  <div class="flex p-8 h-screen bg-white text-black">
    <div class="flex-1 relative max-md:hidden !overflow-hidden">
      <img class="absolute top-0 left-0 w-full h-full rounded-3xl" src="@/assets/img/bg-image-tts.png" alt="" />
    </div>

    <div class="flex-1 flex justify-center items-center">
      <div class="rounded-xl max-md:w-full max-sm:p-0 w-96">
        <div class="flex flex-col items-start gap-2 mb-2 mt-6">
          <h1 class="text-lg font-semibold">Welcome Back</h1>
        </div>
        <div class="mt-6">
          <form @submit="onSubmit">
            <!-- email-->
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel class="text-black">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter email..."
                    v-bind="componentField"
                    class="bg-inherit border-inherit ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black"
                  />
                </FormControl>
                <FormMessage class="text-red-500" />
              </FormItem>
            </FormField>

            <!-- password-->
            <FormField v-slot="{ componentField }" name="password">
              <FormItem class="mt-4">
                <FormLabel class="text-black">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password..."
                    v-bind="componentField"
                    class="bg-inherit border-inherit ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black"
                  />
                </FormControl>
                <FormMessage class="text-red-500" />
              </FormItem>
            </FormField>

            <div class="text-end mt-6">
              <RouterLink class="text-primary text-sm font-semibold" to="/forgot-password">
                Forgot Password ?
              </RouterLink>
            </div>
            <Button class="w-full mt-6 bg-primary hover:bg-blue-600 text-white items-center" type="submit">
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
