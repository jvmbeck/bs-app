<template>
  <div class="text-h3">THIS IS SUPPOSED TO SHOW ALL AVAILABLE USERS</div>
  <q-btn @click="testRegisterUser" label="test register user"></q-btn>
  <UserCreatedDialog v-model="showSuccess" :created-user="userStore.createdUser" />
</template>

<script setup lang="ts">
import { useUserStore } from 'src/stores/user-store';
import UserCreatedDialog from 'src/components/UserCreatedDialog.vue';
import { ref } from 'vue';

const userStore = useUserStore();

const showSuccess = ref(false);

async function testRegisterUser() {
  try {
    const created = await userStore.register('teste1231@mail.com', 'testeName', 'Vendas');
    console.log('COMPONENT created:', created);
    if (created) {
      showSuccess.value = true;
    }
  } catch (error) {
    console.error(error);
  }
}
</script>
