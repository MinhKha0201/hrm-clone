<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { useAuthStore } from '@/stores';
import { useForm } from 'vee-validate';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { useToast } from '@/components/ui/toast';
import { ref } from 'vue';
import { ZUtils } from '@/lib/validation.utils.ts';

const { toast } = useToast();
const authStore = useAuthStore();
const isForgot = ref(false);
const isCountdown = ref(false);
const minutesResend = ref(0);
const secondsResend = ref(0);
const email = ref();

const formSchema = toTypedSchema(
  z.object({
    email: ZUtils.email(),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  email.value = values.email;
  const status = await authStore.forgotPasswordApi(values.email);
  if (status < 400) {
    isForgot.value = true;
    toast({
      title: 'Success',
      variant: 'default',
      description: 'Send email forgot password successfully',
    });
  }
});

const handleResendEmail = async (minutes: number = 5) => {
  const status = await authStore.forgotPasswordApi(email.value as string);
  if (status < 400) {
    isForgot.value = true;
    isCountdown.value = true;
    minutesResend.value = minutes;
    startTimer();
    toast({
      title: 'Success',
      variant: 'default',
      description: 'Send email forgot password successfully',
    });
  }
};

const startTimer = () => {
  secondsResend.value = checkSecond(secondsResend.value - 1);

  if (secondsResend.value == 59) {
    minutesResend.value = minutesResend.value - 1;
  }
  if (minutesResend.value < 0) {
    isCountdown.value = false;
  }

  setTimeout(startTimer, 1000);
};

const checkSecond = (sec: number) => {
  if (sec < 0) {
    sec = 59;
  }
  return sec;
};
</script>

<template>
  <div class="h-screen flex p-8 bg-white text-black">
    <div class="flex-1 relative max-md:hidden">
      <img class="absolute top-0 left-0 w-full h-full rounded-3xl" src="@/assets/img/bg-image-tts.png" alt="" />
    </div>

    <div class="flex-1 flex justify-center items-center">
      <div class="rounded-xl max-md:w-full max-sm:p-0 w-96">
        <div class="flex flex-col items-start gap-2 mb-2 mt-6">
          <h1 class="text-lg font-semibold">Forgot password ?</h1>
          <h1 v-if="isForgot" class="text-sm font-semibold">
            A password reset link has been sent to <span class="text-primary">{{ email }}</span
            >. Click the link to complete the password reset. If you still haven't received the email, please hit resend
            below.
          </h1>
        </div>
        <div>
          <h2 v-if="!isForgot" class="mt-1">Enter your email to reset your password</h2>
        </div>
        <div class="mt-6">
          <form v-if="!isForgot" @submit="onSubmit">
            <FormField v-if="!isForgot" v-slot="{ componentField }" name="email">
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

            <div class="text-end mt-6">
              <RouterLink class="text-sm text-primary font-semibold" to="/login">Come back</RouterLink>
            </div>
            <Button class="w-full mt-6 bg-primary hover:bg-blue-600 text-white items-center" type="submit"
              >Send mail
            </Button>
          </form>

          <Button
            v-else-if="!isCountdown"
            class="mt-4 w-full h-10 bg-primary"
            :variant="isCountdown ? 'secondary' : 'default'"
            @click="handleResendEmail(5)"
            >Resend
          </Button>

          <div class="flex items-center justify-center w-full">
            <div
              v-if="isCountdown"
              class="rounded-full w-28 flex items-center justify-center bg-secondary text-primary font-semibold"
            >
              {{ minutesResend < 10 ? `0${minutesResend}` : minutesResend }}:
              {{ secondsResend < 10 ? `0${secondsResend}` : secondsResend }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
