<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RangeCalendar } from '@/components/ui/range-calendar';
import { cn } from '@/lib/utils';
import { DateFormatter, today } from '@internationalized/date';
import { Calendar as CalendarIcon } from 'lucide-vue-next';
import type { DateRange } from 'radix-vue';
import { type Ref, ref } from 'vue';

interface Prop {
  timeZone?: any;
}

const props = defineProps<Prop>();

const timeZone = ref(props.timeZone || 'Asia/Bangkok');

const df = new DateFormatter('vi-VN', {
  dateStyle: 'short',
  timeZone: timeZone.value,
});

const currentDate = today(timeZone.value);

const value = ref({
  start: today(timeZone.value).set({ day: 1 }),
  end: today(timeZone.value),
}) as Ref<DateRange>;

const emit = defineEmits(['update:range-update']);
const updateFilterReport = (value: DateRange) => {
  if (value.start && value.end) {
    const filter = {
      from_date: value.start.toString(),
      to_date: value.end.toString(),
    };
    emit('update:range-update', filter);
  }
};
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        size="sm"
        :class="cn('w-[280px] justify-start text-left font-normal', !value && 'text-muted-foreground')"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        <template v-if="value.start">
          <template v-if="value.end">
            {{ df.format(value.start.toDate(timeZone)) }} -
            {{ df.format(value.end.toDate(timeZone)) }}
          </template>

          <template v-else>
            {{ df.format(value.start.toDate(timeZone)) }}
          </template>
        </template>
        <template v-else> Pick a date </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <RangeCalendar
        v-model="value"
        initial-focus
        :number-of-months="2"
        :max-value="currentDate"
        @update:start-value="(startDate) => (value.start = startDate)"
        @update:model-value="updateFilterReport"
      />
    </PopoverContent>
  </Popover>
</template>
