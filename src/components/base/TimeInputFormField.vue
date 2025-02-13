<script lang="ts" setup>
import { cn } from '@/lib/utils';
import { ComponentFieldBindingObject } from 'vee-validate';
import { HTMLAttributes } from 'vue';
import FormControl from '../ui/form/FormControl.vue';
import FormDescription from '../ui/form/FormDescription.vue';
import FormItem from '../ui/form/FormItem.vue';
import FormLabel from '../ui/form/FormLabel.vue';
import FormMessage from '../ui/form/FormMessage.vue';
import Input from '../ui/input/Input.vue';

interface Prop {
  label: string;
  componentField: ComponentFieldBindingObject<any>;
  errors: string[];
  class?: HTMLAttributes['class'];
  required?: boolean;
  description?: string;
  message?: boolean;
  disabled?: boolean;
}

const props = defineProps<Prop>();
</script>
<template>
  <FormItem :class="cn('flex flex-col gap-1', props.class)">
    <FormLabel>{{ label }}<span v-if="required" class="text-red-500">*</span></FormLabel>
    <FormControl>
      <div>
        <Input
          type="time"
          v-bind="componentField"
          :class="errors.length > 0 ? 'border-red-500' : ''"
          :disabled="disabled"
          class="focus-visible:ring-0 focus-visible:ring-offset-0 block"
        />
      </div>
    </FormControl>
    <FormDescription v-if="description"> {{ description }} </FormDescription>
    <FormMessage v-if="message" class="!mt-0" />
  </FormItem>
</template>
