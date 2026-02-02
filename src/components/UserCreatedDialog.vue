<template>
  <q-dialog v-model="modelValue" persistent>
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6 q-mb-sm">User created</div>

        <div v-if="createdUser">
          <div class="q-mb-sm"><strong>Email:</strong> {{ createdUser.email }}</div>

          <q-input
            label="Password setup link"
            :model-value="createdUser.resetLink"
            readonly
            dense
          />
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Copy link" color="primary" @click="copyLink" />
        <q-btn flat label="Close" @click="close" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CreateUserResponse } from 'src/models/Payloads';

/**
 * Props
 * modelValue controls dialog visibility (v-model)
 * createdUser is the response from createUser()
 */
const props = defineProps<{
  modelValue: boolean;
  createdUser: CreateUserResponse | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const modelValue = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

async function copyLink() {
  if (!props.createdUser) return;

  try {
    await navigator.clipboard.writeText(props.createdUser.resetLink);
  } catch (err) {
    console.error(err);
  }
}

function close() {
  emit('update:modelValue', false);
}
</script>
