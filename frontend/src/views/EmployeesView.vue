<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'

const employees = ref([])
const error = ref('')
const vacio = { id: null, nombre: '', apellido: '', correo: '', telefono: '', puesto: '' }
const form = ref({ ...vacio })

async function cargar() {
  try {
    const res = await api.get('/employees')
    employees.value = res.data.data ?? res.data
  } catch (e) {
    error.value = 'No se pudieron cargar los empleados'
  }
}

async function guardar() {
  error.value = ''
  try {
    const { id, ...datos } = form.value
    if (id) await api.put(`/employees/${id}`, datos)
    else await api.post('/employees', datos)
    form.value = { ...vacio }
    cargar()
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al guardar'
  }
}

function editar(emp) { 
  form.value = { ...emp } 
}

async function eliminar(id) {
  if (!confirm('¿Eliminar este empleado?')) return
  try {
    await api.delete(`/employees/${id}`)
    cargar()
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al eliminar'
  }
}

onMounted(cargar)
</script>

<template>
  <h2>Empleados</h2>
  <p v-if="error" class="error">{{ error }}</p>

  <form @submit.prevent="guardar">
    <input v-model="form.nombre" placeholder="Nombre" required />
    <input v-model="form.apellido" placeholder="Apellido" required />
    <input v-model="form.correo" type="email" placeholder="Correo" />
    <input v-model="form.telefono" placeholder="Teléfono" />
    <input v-model="form.puesto" placeholder="Puesto" />
    <div class="acciones">
      <button type="submit">{{ form.id ? 'Actualizar' : 'Crear' }}</button>
      <button v-if="form.id" type="button" class="gris" @click="form = { ...vacio }">Cancelar</button>
    </div>
  </form>

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Correo</th>
        <th>Teléfono</th>
        <th>Puesto</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="e in employees" :key="e.id">
        <td>{{ e.id }}</td>
        <td>{{ e.nombre }} {{ e.apellido }}</td>
        <td>{{ e.correo }}</td>
        <td>{{ e.telefono }}</td>
        <td>{{ e.puesto }}</td>
        <td class="acciones">
          <button @click="editar(e)">Editar</button>
          <button class="rojo" @click="eliminar(e.id)">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>