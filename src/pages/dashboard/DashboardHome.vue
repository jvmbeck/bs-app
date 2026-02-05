<template>
  <div>THIS IS THE MAIN PAGE THAT SHOULD OPEN WHEN USER IS LOGGED</div>
  <div>Hello {{ userName }}</div>
  <q-btn @click="testCloudFunction" label="teste"></q-btn>
  <q-btn @click="testRegisterUser" label="test register user"></q-btn>
  <UserCreatedDialog v-model="showSuccess" :created-user="userStore.createdUser" />
</template>

<script setup lang="ts">
import { useUserStore } from 'src/stores/user-store';
import { httpsCallable } from 'firebase/functions';
import { functions } from 'src/key/configKey';
import UserCreatedDialog from 'src/components/UserCreatedDialog.vue';
import { ref } from 'vue';

const userStore = useUserStore();

const userName = userStore.user?.name || 'Guest';

const showSuccess = ref(false);

async function testCloudFunction() {
  await httpsCallable(
    functions,
    'logActivity',
  )({
    opportunityId: '12365',
    companyId: '1234325',
    type: 'Ligação',
    description: 'Contato Inicial',
  });
}
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
