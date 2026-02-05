<template>
  <q-card class="stat-card">
    <q-card-section>
      <div class="text-caption text-grey-7">
        {{ label }}
      </div>

      <div class="text-h5 text-weight-medium">
        {{ value }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: number | string;
}>();
</script>

<style scoped>
.stat-card {
  height: 100%;
}
</style>
