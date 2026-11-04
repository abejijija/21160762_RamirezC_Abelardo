<template>
  <nav class="menu">
    <RouterLink to="/users">Usuarios</RouterLink>
    <RouterLink to="/employees">Empleados</RouterLink>
    <RouterLink to="/roles">Roles</RouterLink>
  </nav>
  <main class="contenido">
    <RouterView />
  </main>
</template>

<style>
body { margin: 0; font-family: Arial, sans-serif; background: #f4f6f8; color: #222; }
.menu { background: #1f2937; padding: 14px 24px; display: flex; gap: 20px; }
.menu a { color: #cbd5e1; text-decoration: none; font-weight: bold; }
.menu a.router-link-active { color: #fff; border-bottom: 2px solid #38bdf8; }
.contenido { max-width: 900px; margin: 24px auto; padding: 0 16px; }
h2 { margin-top: 0; }
form { background: #fff; padding: 16px; border-radius: 8px; display: grid; gap: 10px; margin-bottom: 20px; }
input, select { padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; }
button { padding: 8px 14px; border: 0; border-radius: 6px; cursor: pointer; background: #2563eb; color: #fff; }
button.rojo { background: #dc2626; }
button.gris { background: #6b7280; }
table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; }
th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
th { background: #e2e8f0; }
.acciones { display: flex; gap: 6px; }
.error { color: #dc2626; margin-bottom: 10px; }
</style>