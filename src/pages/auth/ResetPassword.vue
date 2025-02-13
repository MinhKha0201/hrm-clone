<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'vee-validate';
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { IQuestion, useAuthStore, useConfirmDialogStore } from '@/stores';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '@/components/ui/toast';
import { ZUtils } from '@/lib/validation.utils.ts';

const { toast } = useToast();

const formSchema = toTypedSchema(
  z
    .object({
      password: ZUtils.password(),
      confirmPassword: ZUtils.password(),
    })
    .refine((data: any) => data.password === data.confirmPassword, {
      message: "Passwords don't match.",
      path: ['confirmPassword'],
    })
);

const authStore = useAuthStore();
const confirmDialog = useConfirmDialogStore();
const router = useRouter();
const route = useRoute();

const token = ref();

onMounted(() => {
  token.value = route.query.token;
  if (!token) {
    router.push('/login');
  }
  verifyResetPassword(token.value);
});

const verifyResetPassword = async (token: string) => {
  const response = await authStore.verifyTokenResetPassword(token);
  if (response.status >= 400) {
    openConfirmError({
      title: 'Failed',
      question: response.data.message ?? 'Expired password recovery link',
      onlyConfirm: true,
      error: true,
    });
  }
};

const form = useForm({
  validationSchema: formSchema,
});

const openConfirmError = async (data: IQuestion) => {
  await confirmDialog.open(data);
  router.push('/login');
};

const openConfirmSuccess = async () => {
  await confirmDialog.open({
    title: 'Success',
    question: 'Reset password successfully',
    onlyConfirm: true,
    success: true,
  });

  router.push('/login');
};
const onSubmit = form.handleSubmit(async (values) => {
  const { password, confirmPassword } = values;

  const status = await authStore.resetPasswordApi({ password, confirmPassword, token: token.value });

  if (status < 400) {
    toast({
      title: 'Success',
      variant: 'default',
      description: 'Reset password successfully',
    });
    openConfirmSuccess();
  }
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
          <h1 class="text-lg font-semibold">Reset Password</h1>
        </div>
        <div class="flex flex-row gap-2 mb-2">
          <h2 class="mt-1">Have you already reset the password ?</h2>
          <RouterLink class="mt-1 text-primary font-semibold" to="/login">Login</RouterLink>
        </div>
        <div class="mt-6">
          <form @submit="onSubmit">
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

            <!-- password-->
            <FormField v-slot="{ componentField }" name="confirmPassword">
              <FormItem class="mt-4">
                <FormLabel class="text-black">Confirm Password</FormLabel>
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

            <Button class="w-full mt-6 bg-primary hover:bg-blue-600 text-white items-center" type="submit">
              Confirm Reset Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
