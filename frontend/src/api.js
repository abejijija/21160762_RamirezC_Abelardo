import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000', // Reemplaza 3000 por el puerto donde esté corriendo tu backend
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api