<script lang="ts" setup>
interface Prop {
  errorList: any;
}

defineProps<Prop>();
</script>
<template>
  <div>
    <ul>
      <li v-for="(item, index) in errorList" :key="index">{{ item.message }}</li>
    </ul>
  </div>
</template>
