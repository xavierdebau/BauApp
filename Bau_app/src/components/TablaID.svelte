<!-- TablaID.svelte -->

<script lang="ts">
    // Importar las librerías necesarias y definir las variables
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';  
    import { Table } from '@skeletonlabs/skeleton';
    import type { TableSource } from '@skeletonlabs/skeleton';
    import { auth, tablaID } from '../lib/firebase/firebase';
    import { addDoc,onSnapshot,doc, deleteDoc} from 'firebase/firestore';
    
    // Variables y lógica necesarias
    
    // Función para cargar los activos anteriores desde Firestore y actualizar el store
    async function cargarActivosAnteriores() {
        try {
            const querySnapshot = await onSnapshot(tablaID, (snapshot) => {
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

    export const activosAnteriores = writable([]);
    // Campos del formulario
    let codigoCliente = '';
    let codigoActivo = '';
    let nombreActivo = '';
    let direccion = '';
    let fechaInicio = new Date().toISOString().split('T')[0];
    let tipoObra = '';
    let tipoEdificio = '';
    let cantidadPisos = '';
    let superficie = '';
    let subterraneo = '';
  
    // Lista de opciones para cantidad de pisos y superficie
    const listaCantidadPisos = ["1", "2", "3", "4", "5 o más"];
    const listaSuperficie = ["Menos de 50m²", "50m² - 100m²", "100m² - 200m²", "Más de 200m²"];
  
    // Store para manejar la visibilidad del campo de subterráneo
    const showSubterraneo = writable(false);
  
    // Función para manejar los cambios en el tipo de obra y mostrar/ocultar el campo de subterráneo
    function handleTipoObraChange(event) {
      const selectedTipoObra = event.target.value;
      showSubterraneo.set(selectedTipoObra !== 'Proyecto de obra nueva' && selectedTipoObra !== 'Proyecto de modificación');
    }
  
    // Ocultar el campo de subterráneo por defecto
    onMount(() => {
      cargarActivosAnteriores();  
      showSubterraneo.set(false);
    });

    // Función para limpiar los campos del formulario
    function limpiarFormulario() {
        codigoCliente = '';
        codigoActivo = '';
        nombreActivo = '';
        direccion = '';
        fechaInicio = new Date().toISOString().split('T')[0]; // Restaurar la fecha al valor por defecto
        tipoObra = '';
        tipoEdificio = '';
        cantidadPisos = '';
        superficie = '';
        subterraneo = '';
    }

    // Obtener el ID del usuario logeado
    function getUserId() {
        // Verificar si hay un usuario actualmente autenticado
        const currentUser = auth.currentUser;
        return currentUser ? currentUser.uid : null;
    }
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
        codigoCliente,
        codigoActivo,
        nombreActivo,
        direccion,
        fechaInicio,
        tipoObra,
        tipoEdificio,
        cantidadPisos,
        superficie,
        subterraneo,
        fecha_creacion
        };

        try {
        // Agrega los datos del nuevo activo a la colección en Firestore
        await addDoc(tablaID, nuevoActivo);
        console.log('Datos del activo agregados a Firestore con éxito.');
        limpiarFormulario(); // Limpia los campos del formulario después de agregar el activo
        } catch (error) {
        console.error('Error al agregar los datos del activo a Firestore:', error);
        }
    }
    // Función para borrar un elemnto
    async function handleDelete(id: string) {
        try {
            await deleteDoc(doc(tablaID, id));
            console.log('Activo eliminado con éxito.');
        } catch (error) {
            console.error('Error al eliminar el activo:', error);
        }
    }
  </script>
  
<!-- Estructura HTML del formulario -->
<div class="formulario bg-c16029 rounded-lg shadow-lg p-4">
    <label for="codigoCliente" class="block text-sm font-medium text-gray-100">Código 01 (cliente):</label>
    <input type="text" id="codigoCliente" bind:value={codigoCliente} class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black">
  
    <label for="codigoActivo" class="block text-sm font-medium text-gray-100">Código 02 (activo):</label>
    <input type="text" id="codigoActivo" bind:value={codigoActivo} class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black">
  
    <label for="nombreActivo" class="block text-sm font-medium text-gray-100">Nombre activo:</label>
    <input type="text" id="nombreActivo" bind:value={nombreActivo} class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black">
  
    <label for="direccion" class="block text-sm font-medium text-gray-100">Dirección:</label>
    <input type="text" id="direccion" bind:value={direccion} class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black">
  
    <label for="fechaInicio" class="block text-sm font-medium text-gray-100">Fecha de inicio:</label>
    <input type="date" id="fechaInicio" bind:value={fechaInicio} class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black">
  
    <label for="tipoObra" class="block text-sm font-medium text-gray-100">Es proyecto de obra nueva, proyecto de modificación o evaluación de entorno existente:</label>
    <select id="tipoObra" bind:value={tipoObra} on:change={handleTipoObraChange} class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black">
      <option value="Proyecto de obra nueva">Proyecto de obra nueva</option>
      <option value="Proyecto de modificación">Proyecto de modificación</option>
      <option value="Evaluación de entorno existente">Evaluación de entorno existente</option>
    </select>
  
    <label for="tipoEdificio" class="block text-sm font-medium text-gray-100">Tipo edificio:</label>
    <input type="text" id="tipoEdificio" bind:value={tipoEdificio} class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black">
  
    <label for="cantidadPisos" class="block text-sm font-medium text-gray-100">Cantidad pisos:</label>
    <select id="cantidadPisos" bind:value={cantidadPisos} class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black">
      {#each listaCantidadPisos as piso}
        <option value={piso}>{piso}</option>
      {/each}
    </select>
  
    <label for="superficie" class="block text-sm font-medium text-gray-100">Superficie:</label>
    <select id="superficie" bind:value={superficie} class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black">
      {#each listaSuperficie as superficieRange}
        <option value={superficieRange}>{superficieRange}</option>
      {/each}
    </select>
  
    {#if $showSubterraneo}
      <label for="subterraneo" class="block text-sm font-medium text-gray-100">Subterráneo (sí/no):</label>
      <select id="subterraneo" bind:value={subterraneo} class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black">
        <option value="Sí">Sí</option>
        <option value="No">No</option>
      </select>
    {/if}
    <button on:click={handleSubmit} class="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600 mt-4">Crear Activo</button>
  </div>

  <div class="max-w-full mt-8">
    <table class="w-full border-collapse rounded-lg bg-gray-300">
      <thead>
        <tr class="bg-gray-400">
          <th class="px-4 py-2 text-white">Código Cliente</th>
          <th class="px-4 py-2 text-white">Código Activo</th>
          <th class="px-4 py-2 text-white">Nombre Activo</th>
          <th class="px-4 py-2 text-white">Dirección</th>
          <th class="px-4 py-2 text-white">Fecha de Inicio</th>
          <th class="px-4 py-2 text-white">Tipo de Obra</th>
          <th class="px-4 py-2 text-white">Tipo de Edificio</th>
          <th class="px-4 py-2 text-white">Cantidad de Pisos</th>
          <th class="px-4 py-2 text-white">Superficie</th>
          <th class="px-4 py-2 text-white">Subterráneo</th>
        </tr>
      </thead>
      <tbody>
        {#each $activosAnteriores as activo}
          <tr class="border-b">
            <td class="px-4 py-2">{activo.codigoCliente}</td>
            <td class="px-4 py-2">{activo.codigoActivo}</td>
            <td class="px-4 py-2">{activo.nombreActivo}</td>
            <td class="px-4 py-2">{activo.direccion}</td>
            <td class="px-4 py-2">{activo.fechaInicio}</td>
            <td class="px-4 py-2">{activo.tipoObra}</td>
            <td class="px-4 py-2">{activo.tipoEdificio}</td>
            <td class="px-4 py-2">{activo.cantidadPisos}</td>
            <td class="px-4 py-2">{activo.superficie}</td>
            <td>
              <button class="bg-red-500 text-white px-2 py-1 rounded-md transition duration-300 ease-in-out hover:bg-red-600" on:click={() => handleDelete(activo.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                  </svg>
              </button>
          </td>
        {/each}
      </tbody>
    </table>
  </div>

  <style>
    /* Estilos CSS para el formulario */
    .formulario {
      max-width: 600px;
      margin: 0 auto;
      border: 1px solid #ccc;
      background-color: #2b2929; 
      border-radius: 8px;
      padding: 20px;
    }
  
    .formulario label {
      display: block;
      margin-bottom: 5px;
    }
  
    .formulario input,
    .formulario select {
      width: 100%;
      padding: 10px;
      border: 1px solid #1b20ad;
      border-radius: 5px;
      margin-bottom: 10px;
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
      display: block;
      margin-top: 10px;
    }
  
    .formulario button:hover {
      background-color: #0056b3;
    }
  </style>