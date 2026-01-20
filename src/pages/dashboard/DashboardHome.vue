import { useUserStore } from '../../stores/user-store';
<template>
  <div>THIS IS THE MAIN PAGE THAT SHOULD OPEN WHEN USER IS LOGGED</div>
  <div>Hello {{ userName }}</div>
  <q-btn @click="testCloudFunction" label="teste"></q-btn>
</template>
<script setup lang="ts">
import { useUserStore } from 'src/stores/user-store';
import { httpsCallable } from 'firebase/functions';
import { functions } from 'src/key/configKey';
const userStore = useUserStore();

const userName = userStore.user?.name || 'Guest';

async function testCloudFunction() {
  await httpsCallable(
    functions,
    'logActivity',
  )({
    opportunityId: '12345',
    companyId: '1234325',
    type: 'Ligação',
    description: 'Contato Inicial',
  });
}
</script>
