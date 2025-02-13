import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export interface IQuestion {
  title: string;
  question: string;
  actionConfirm?: any;
  actionCancel?: any;
  data?: any;
  onlyConfirm?: boolean;
  success?: boolean;
  error?: boolean;
}

export const useConfirmDialogStore = defineStore('modal-confirm-dialog', () => {
  /**
   *  define state
   */

  const data = ref<IQuestion | null>(null);

  /**
   *  define getter
   */
  const getQuestion = computed(() => data.value);

  /**
   *  define action
   */

  const open = (_data: IQuestion) => {
    data.value = _data;
  };

  const confirm = (value: boolean) => {
    data.value = null;
  };

  return {
    data,
    getQuestion,
    open,
    confirm,
  };
});
