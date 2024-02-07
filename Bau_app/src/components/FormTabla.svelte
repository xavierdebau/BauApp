<script lang="ts">
  import { Table } from '@skeletonlabs/skeleton';
  import type { TableSource } from '@skeletonlabs/skeleton';
  import { writable } from 'svelte/store';
  import { auth, activosCollection } from '../lib/firebase/firebase';
  import { addDoc,onSnapshot, collection } from 'firebase/firestore';
  


 
  // Función para cargar los activos anteriores desde Firestore y actualizar el store
  async function cargarActivosAnteriores() {
      try {
          const querySnapshot = await onSnapshot(activosCollection, (snapshot) => {
              const activos = [];
              snapshot.forEach((doc) => {
                  activos.push({ id: doc.id, ...doc.data() });
              });
              activosAnteriores.set(activos);
          });
      } catch (error) {
          console.error('Error al cargar los activos anteriores:', error);
      }
  }


  // Llamar a la función para cargar los activos anteriores al iniciar la aplicación
  cargarActivosAnteriores();
  // Definir el store para los activos anteriores
  export const activosAnteriores = writable([]);

  // Variables del formulario
  let id_cliente = '';
  let nombre = '';
  let direccion = '';
  let tipo_obra = '';
  let componente = '';
  let nivel = '';
  let comentarios = '';
  let activo = false;

  // Opciones para tipo de obra y nivel
  const tiposDeObra = ["nueva", "modificación", "evaluación"];
  const niveles = ["subsuelo", "primer piso", "otro"];
  const componentes = ["Cruce","Desnibel","Rebaja de vereda","Estacionamiento","Entorno","Acceso","Meson y area de atención","Puertas de Acceso/Evacuación","Puertas otros recintos","Rampas/Planos inclinados","Escaleras/Escaleras Mecanicas","Servicio Hegiénico","Evacuación","Camarín","Auditoria/Grandes salas"];
  const estadoDeActivo = ["Cumple","No Cumple","Observación Condicional","No Aplica"];

  // Función para limpiar los campos del formulario
  function limpiarFormulario() {
      id_cliente = '';
      nombre = '';

      direccion = '';
      tipo_obra = '';
      componente = '';
      nivel = '';
      comentarios = '';
      activo = false;
  }

  // Obtener el ID del usuario logeado
  function getUserId() {
    // Verificar si hay un usuario actualmente autenticado
    const currentUser = auth.currentUser;
    return currentUser ? currentUser.uid : null;
  }

  // Generar un ID único para el activo
  function generateUniqueId() {
      return Math.random().toString(36).substr(2, 9); // Implementa la lógica para generar un ID único
  }

  // Función para manejar el envío del formulario
  async function handleSubmit() {
      const id_creador = getUserId();
      const id_activo = generateUniqueId();
      const fecha_creacion = new Date().toISOString();

      const nuevoActivo = {
          id_creador,
          id_cliente,
          id_activo,
          fecha_creacion,
          nombre,
          direccion,
          tipo_obra,
          componente,
          nivel,
          comentarios,
          activo
      };

      try {
          // Agrega los datos del nuevo activo a la colección en Firestore
          await addDoc(activosCollection, nuevoActivo);
          console.log('Datos del activo agregados a Firestore con éxito.');
          activosAnteriores.update(activos => [...activos, nuevoActivo]);
          limpiarFormulario();
      } catch (error) {
          console.error('Error al agregar los datos del activo a Firestore:', error);
      }
  }
</script>

<style>
  .formulario {
    max-width: 600px;
    margin: 0 auto;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 20px;
  }

  .formulario h2 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .formulario form {
    background-color: #c16029;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-wrap: wrap;
  }

  .formulario .campo {
    margin-bottom: 15px;
    flex: 1 1 calc(50% - 15px); /* Ajusta según la cantidad de campos que deseas en una fila */
  }

  .formulario label {
    display: block;
    margin-bottom: 5px;
  }

  .formulario input,
  .formulario select,
  .formulario textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #1b20ad;
    border-radius: 5px;
  }

  .formulario button {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }

  .formulario button:hover {
    background-color: #0056b3;
  }
  
</style>
<!-- Formulario de Creación -->
<div class="formulario bg-c16029 rounded-lg shadow-lg">
  <h2 class="text-2xl font-semibold mb-4">Crear Nuevo Activo</h2>
  <form class="flex flex-wrap" on:submit|preventDefault={handleSubmit}>
    <div class="w-full md:w-1/2 px-3 mb-6">
        <label for="id_cliente" class="block text-sm font-medium text-gray-700">ID Cliente:</label>
        <input type="text" id="id_cliente" class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:value={id_cliente} />
    </div>

    <div class="w-full md:w-1/2 px-3 mb-6">
        <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre:</label>
        <input type="text" id="nombre" class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:value={nombre} />
    </div>

    <div class="w-full md:w-1/2 px-3 mb-6">
        <label for="direccion" class="block text-sm font-medium text-gray-700">Dirección:</label>
        <input type="text" id="direccion" class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:value={direccion} />
    </div>

    <div class="w-full md:w-1/2 px-3 mb-6">
        <label for="tipo_obra" class="block text-sm font-medium text-gray-700">Tipo de Obra:</label>
        <select id="tipo_obra" class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:value={tipo_obra}>
            <option value="">Seleccionar tipo de obra</option>
            {#each tiposDeObra as tipo}
                <option value={tipo}>{tipo}</option>
            {/each}
        </select>
    </div>

    <div class="w-full md:w-1/2 px-3 mb-6">
        <label for="componente" class="block text-sm font-medium text-gray-700">Componente:</label>
        <select id="componente" class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:value={componente}>
          <option value="">Componente</option>
          {#each componentes as component}
              <option value={component}>{component}</option>
          {/each}
      </select>
    </div>

    <div class="w-full md:w-1/2 px-3 mb-6">
        <label for="nivel" class="block text-sm font-medium text-gray-700">Nivel:</label>
        <select id="nivel" class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:value={nivel}>
            <option value="">Seleccionar nivel</option>
            {#each niveles as nivel_opcion}
                <option value={nivel_opcion}>{nivel_opcion}</option>
            {/each}
        </select>
    </div>

    <div class="w-full px-3 mb-6">
        <label for="comentarios" class="block text-sm font-medium text-gray-700">Comentarios:</label>
        <textarea id="comentarios" class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:value={comentarios}></textarea>
    </div>

    <div class="w-full px-3 mb-6">
        <label for="activo" class="block text-sm font-medium text-gray-700">Activo:</label>
        <select id="activo" class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:value={activo}>
          <option value="">Indicación de Cumplimientos</option>
          {#each estadoDeActivo as estado}
              <option value={estado}>{estado}</option>
          {/each}
      </select>
    </div>

    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600">Crear Activo</button>
</form>
</div>

<!-- Lista de Activos -->
<div class="max-w-full ">
  <table class="w-full border-collapse rounded-lg bg-gray-300">
    <thead>
      <tr class="bg-gray-400">
        <th class="px-4 py-2 text-white">ID Cliente</th>
        <th class="px-4 py-2 text-white">Nombre</th>
        <th class="px-4 py-2 text-white">Dirección</th>
        <th class="px-4 py-2 text-white">Tipo de Obra</th>
        <th class="px-4 py-2 text-white">Componente</th>
        <th class="px-4 py-2 text-white">Nivel</th>
        <th class="px-4 py-2 text-white">Comentarios</th>
        <th class="px-4 py-2 text-white">Activo</th>
      </tr>
    </thead>
    <tbody>
      {#each $activosAnteriores as activo}
        <tr class="border-b">
          <td class="px-4 py-2">{activo.id_cliente}</td>
          <td class="px-4 py-2">{activo.nombre}</td>
          <td class="px-4 py-2">{activo.direccion}</td>
          <td class="px-4 py-2">{activo.tipo_obra}</td>
          <td class="px-4 py-2">{activo.componente}</td>
          <td class="px-4 py-2">{activo.nivel}</td>
          <td class="px-4 py-2">{activo.comentarios}</td>
          <td class="px-4 py-2">{activo.activo}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>


