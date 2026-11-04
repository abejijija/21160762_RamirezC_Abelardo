<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'

const users = ref([])
const roles = ref([])
const error = ref('')
const vacio = { id: null, username: '', email: '', password: '', role_id: '', is_active: true }
const form = ref({ ...vacio })

async function cargar() {
  try {
    const [u, r] = await Promise.all([api.get('/users'), api.get('/roles')])
    users.value = u.data.data ?? u.data
    roles.value = r.data.data ?? r.data
  } catch (e) {
    error.value = 'No se pudieron cargar los usuarios'
  }
}

async function guardar() {
  error.value = ''
  try {
    const datos = {
      username: form.value.username,
      email: form.value.email,
      role_id: Number(form.value.role_id),
      is_active: form.value.is_active
    }
    if (form.value.password) datos.password = form.value.password

    if (form.value.id) await api.put(`/users/${form.value.id}`, datos)
    else await api.post('/users', datos)

    form.value = { ...vacio }
    cargar()
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al guardar'
  }
}

function editar(u) { form.value = { ...u, password: '' } }

async function eliminar(id) {
  if (!confirm('¿Eliminar este usuario?')) return
  try {
    await api.delete(`/users/${id}`)
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
    <label><input type="checkbox" v-model="form.is_active" /> Activo</label>
    <div class="acciones">
      <button type="submit">{{ form.id ? 'Actualizar' : 'Crear' }}</button>
      <button v-if="form.id" type="button" class="gris" @click="form = { ...vacio }">Cancelar</button>
    </div>
  </form>

  <table>
    <thead><tr><th>ID</th><th>Usuario</th><th>Correo</th><th>Rol</th><th>Activo</th><th>Acciones</th></tr></thead>
    <tbody>
      <tr v-for="u in users" :key="u.id">
        <td>{{ u.id }}</td>
        <td>{{ u.username }}</td>
        <td>{{ u.email }}</td>
        <td>{{ nombreRol(u.role_id) }}</td>
        <td>{{ u.is_active ? 'Sí' : 'No' }}</td>
        <td class="acciones">
          <button @click="editar(u)">Editar</button>
          <button class="rojo" @click="eliminar(u.id)">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>