<template>
  <q-table
    title="Usuários"
    :rows="users"
    :columns="columns"
    row-key="id"
    :loading="loading"
    flat
    bordered
  >
    <template #body-cell-active="props">
      <q-td :props="props">
        <q-badge :color="props.value ? 'positive' : 'grey'" outline>
          {{ props.value ? 'Ativo' : 'Inativo' }}
        </q-badge>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar';
import type { UserAdminDTO } from 'src/services/users/index';

defineProps<{
  users: UserAdminDTO[];
  loading: boolean;
}>();

const columns: QTableColumn[] = [
  { name: 'name', label: 'Nome', field: 'name', sortable: true },
  { name: 'email', label: 'Email', field: 'email' },
  { name: 'role', label: 'Função', field: 'role' },
  { name: 'active', label: 'Status', field: 'active' },
];
</script>
