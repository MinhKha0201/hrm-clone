<script lang="ts" setup>
import { cn } from '@/lib/utils';
import { CalendarDate, DateFormatter, DateValue, getLocalTimeZone, parseDate } from '@internationalized/date';
import { CalendarIcon } from 'lucide-vue-next';
import { computed, HTMLAttributes, onUpdated, ref, watch } from 'vue';
import Button from '../ui/button/Button.vue';
import Calendar from '../ui/calendar/Calendar.vue';
import FormControl from '../ui/form/FormControl.vue';
import FormItem from '../ui/form/FormItem.vue';
import FormLabel from '../ui/form/FormLabel.vue';
import Popover from '../ui/popover/Popover.vue';
import PopoverContent from '../ui/popover/PopoverContent.vue';
import PopoverTrigger from '../ui/popover/PopoverTrigger.vue';

const df = new DateFormatter('vi-VN', {
  dateStyle: 'short',
});

interface Prop {
  label: string;
  required?: boolean;
  value?: string;
  placeholder: any;
  errors?: string[];
  maxDate?: string;
  minDate?: string;
  class?: HTMLAttributes['class'];
}

const props = defineProps<Prop>();
const emit = defineEmits<{ (e: 'update:pick', date: string | undefined): void }>();
// Compute min and max values
const minValue = computed(() => (props.minDate ? parseDate(props.minDate) : undefined));
const maxValue = computed(() => (props.maxDate ? parseDate(props.maxDate) : undefined));

const refPlaceholder = ref(props.placeholder);
const refValue = computed(() => (props.value ? parseDate(props.value) : undefined));

const handlePick = (v: DateValue | undefined) => {
  emit('update:pick', v?.toString());
};
</script>
<template>
  <FormItem class="flex flex-col gap-1">
    <FormLabel>{{ label }}<span v-if="required" class="text-red-500">*</span></FormLabel>
    <Popover>
      <PopoverTrigger as-child>
        <FormControl>
          <Button
            variant="outline"
            :class="
              cn(
                'ps-3 text-start font-normal gap-2',
                !refValue && 'text-muted-foreground',
                errors && errors.length > 0 ? 'border-red-500' : '',
                props.class
              )
            "
          >
            <span>{{ refValue ? df.format(refValue.toDate(getLocalTimeZone())) : 'Pick a date' }}</span>
            <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
          </Button>
          <input hidden />
        </FormControl>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <Calendar
          v-model:placeholder="refPlaceholder"
          v-model="refValue"
          :calendar-label="label"
          initial-focus
          :min-value="minValue || new CalendarDate(1900, 1, 1)"
          :max-value="maxValue"
          @update:model-value="handlePick"
        />
      </PopoverContent>
    </Popover>
  </FormItem>
</template>
