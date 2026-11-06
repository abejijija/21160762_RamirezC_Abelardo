<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'

const users = ref([])
const roles = ref([])
const error = ref('')

const vacio = { id: null, username: '', email: '', password: '', role_id: '' }
const form = ref({ ...vacio })

async function cargar() {
  try {
    error.value = ''
    const [u, r] = await Promise.all([
      api.get('/api/v2/usuarios'),
      api.get('/api/v2/roles')
    ])
    users.value = u.data.data ?? u.data
    roles.value = r.data.data ?? r.data
  } catch (e) {
    error.value = 'No se pudieron cargar los usuarios o roles'
  }
}

async function guardar() {
  error.value = ''
  try {
    const datos = {
      username: form.value.username.trim(),
      email: form.value.email.trim(),
      role_id: Number(form.value.role_id)
    }
    if (form.value.password) datos.password = form.value.password

    if (form.value.id) {
      await api.put(`/api/v2/usuarios/${form.value.id}`, datos)
    } else {
      await api.post('/api/v2/usuarios', datos)
    }
    form.value = { ...vacio }
    cargar()
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al guardar'
  }
}

function editar(u) {
  form.value = {
    id: u.id,
    username: u.username,
    email: u.email,
    password: '',
    role_id: u.role_id
  }
}

async function eliminar(id) {
  if (!confirm('¿Eliminar este usuario?')) return
  try {
    await api.delete(`/api/v2/usuarios/${id}`)
    cargar()
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al eliminar'
  }
}

function nombreRol(id) {
  return roles.value.find(r => r.id === id)?.name ?? id
}

onMounted(cargar)
</script>

<template>
  <h2>Usuarios</h2>
  <p v-if="error" class="error">{{ error }}</p>

  <form @submit.prevent="guardar">
    <input v-model="form.username" placeholder="Usuario" required />
    <input v-model="form.email" type="email" placeholder="Correo" required />
    <input v-model="form.password" type="password"
      :placeholder="form.id ? 'Nueva contraseña (opcional)' : 'Contraseña'"
      :required="!form.id" />
    <select v-model="form.role_id" required>
      <option value="" disabled>Selecciona un rol</option>
      <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.name }}</option>
    </select>
    <div class="acciones">
      <button type="submit">{{ form.id ? 'Actualizar' : 'Crear' }}</button>
      <button v-if="form.id" type="button" class="gris" @click="form = { ...vacio }">Cancelar</button>
    </div>
  </form>

  <table>
    <thead>
      <tr><th>ID</th><th>Usuario</th><th>Correo</th><th>Rol</th><th>Acciones</th></tr>
    </thead>
    <tbody>
      <tr v-for="u in users" :key="u.id">
        <td>{{ u.id }}</td>
        <td>{{ u.username }}</td>
        <td>{{ u.email }}</td>
        <td>{{ nombreRol(u.role_id) }}</td>
        <td class="acciones">
          <button @click="editar(u)">Editar</button>
          <button class="rojo" @click="eliminar(u.id)">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>