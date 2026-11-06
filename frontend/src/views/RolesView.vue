<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'

const roles = ref([])
const error = ref('')
const vacio = { id: null, name: '', description: '' }
const form = ref({ ...vacio })

async function cargar() {
  try {
    const res = await api.get('/api/v2/roles')
    roles.value = res.data.data ?? res.data
  } catch (e) {
    error.value = 'No se pudieron cargar los roles'
  }
}

async function guardar() {
  error.value = ''
  try {
    const datos = { name: form.value.name, description: form.value.description }
    if (form.value.id) await api.put(`/api/v2/roles/${form.value.id}`, datos)
    else await api.post('/api/v2/roles', datos)
    form.value = { ...vacio }
    cargar()
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al guardar'
  }
}

function editar(r) {
  form.value = { id: r.id, name: r.name, description: r.description ?? '' }
}

async function eliminar(id) {
  if (!confirm('¿Eliminar este rol?')) return
  try {
    await api.delete(`/api/v2/roles/${id}`)
    cargar()
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al eliminar'
  }
}

onMounted(cargar)
</script>

<template>
  <h2>Roles</h2>
  <p v-if="error" class="error">{{ error }}</p>

  <form @submit.prevent="guardar">
    <input v-model="form.name" placeholder="Nombre (admin, manager, cashier)" required />
    <input v-model="form.description" placeholder="Descripción" />
    <div class="acciones">
      <button type="submit">{{ form.id ? 'Actualizar' : 'Crear' }}</button>
      <button v-if="form.id" type="button" class="gris" @click="form = { ...vacio }">Cancelar</button>
    </div>
  </form>

  <table>
    <thead><tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr></thead>
    <tbody>
      <tr v-for="r in roles" :key="r.id">
        <td>{{ r.id }}</td>
        <td>{{ r.name }}</td>
        <td>{{ r.description }}</td>
        <td class="acciones">
          <button @click="editar(r)">Editar</button>
          <button class="rojo" @click="eliminar(r.id)">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>