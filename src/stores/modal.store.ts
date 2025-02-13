import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useModalStore = defineStore('modal-store', () => {
  // define state
  const isOpen = ref(false);
  const data = ref<any>();

  // define function

  return {
    isOpen,
    data,
  };
});
