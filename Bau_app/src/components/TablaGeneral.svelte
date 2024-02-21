<script lang="ts">
    // Importar las librerías necesarias y definir las variables
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';  
    import { tablaGeneral,auth } from '../lib/firebase/firebase';
    import { addDoc, onSnapshot } from 'firebase/firestore';
  
    const componentes = ["Cruce","Desnivel","Rebaja de vereda","Estacionamiento","Entorno","Acceso","Mesón y area de atención","Puertas de Acceso/Evacuación","Puertas otros recintos","Rampas/Planos inclinados","Escaleras/Escaleras Mecanicas","Servicio Hegiénico","Evacuación","Camarín","Auditoria/Grandes salas"];
    const estadoDeActivo = ["Cumple","No Cumple","Observación Condicional","No Aplica"];
  
    let codigoCliente: string = ''; // Variable para el código del cliente
    let codigoActivo: string = ''; // Variable para el código del activo
    let nombreActivo: string = ''; // Variable para el nombre del activo
    
    let componente: string[] = []; // Selección de componentes a evaluar
    let nombreComponente: string = ''; // Nombre especifico de componentes a evaluar
    let comentarios: string = ''; // Comentarios breves
    let cumplimientos: Record<string, string> = {}; // Opciones de cumplimiento para cada componente
  
  
    // Función para cargar los activos anteriores desde Firestore y actualizar el store
    async function cargarActivosAnteriores() {
      try {
        const querySnapshot = await onSnapshot(tablaGeneral, (snapshot) => {
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
    function getUserId() {
    // Verificar si hay un usuario actualmente autenticado
        const currentUser = auth.currentUser;
        return currentUser ? currentUser.uid : null;
    }
  
    // Llamar a la función para cargar los activos anteriores al iniciar la aplicación
    cargarActivosAnteriores();
    // Definir el store para los activos anteriores
    export const activosAnteriores = writable([]);
    // Función para limpiar los campos del formulario
    function limpiarFormulario() {
      comentarios = '';
      nombreComponente = '';
      componente= [];
      cumplimientos = {};
    };
  
    // Función para manejar el envío del formulario
    async function handleSubmit() {
        const id_creador = getUserId();
        const fecha_creacion = new Date().toISOString();
        const nuevoActivo = {
            id_creador,
            fecha_creacion,
            codigoCliente,
            codigoActivo,
            nombreActivo,
            componente,
            nombreComponente,
            comentarios,
            cumplimientos
        };
        
    
        try {
            // Agrega los datos del nuevo activo a la colección en Firestore
            await addDoc(tablaGeneral, nuevoActivo);
            console.log('Datos del activo agregados a Firestore con éxito.');
            limpiarFormulario(); // Limpia los campos del formulario después de agregar el activo
        } catch (error) {
            console.error('Error al agregar los datos del activo a Firestore:', error);
        }
    };
  
    onMount(() => {
      cargarActivosAnteriores();  
    });
</script>

<div class="formulario bg-c16029 rounded-lg shadow-lg p-4">
  <!-- Selección de componentes, niveles y comentarios -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="mb-6">
          <label for="codigoCliente" class="block text-sm font-medium text-gray-100">Código Cliente:</label>
          <input type="text" id="codigoCliente" class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:value={codigoCliente}>
      </div>

      <div class="mb-6">
          <label for="codigoActivo" class="block text-sm font-medium text-gray-100">Código Activo:</label>
          <input type="text" id="codigoActivo" class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:value={codigoActivo}>
      </div>

      <div class="mb-6">
          <label for="nombreActivo" class="block text-sm font-medium text-gray-100">Nombre Activo:</label>
          <input type="text" id="nombreActivo" class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:value={nombreActivo}>
      </div>

      <div class="mb-6">
          <label for="nombreComponente" class="block text-sm font-medium text-gray-100">Nombre Componente:</label>
          <input type="text" id="nombreComponente" class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:value={nombreComponente}>
      </div>

      <div class="mb-6">
          <label for="componente" class="block text-sm font-medium text-gray-100">Componente:</label>
          <select id="componente" class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:value={componente}>
              <option value="">Componente</option>
              {#each componentes as component}
                  <option value={component}>{component}</option>
              {/each}
          </select>
      </div>

      <div class="mb-6">
          <label for="cumplimientos" class="block text-sm font-medium text-gray-100">Cumplimientos:</label>
          <select id="cumplimientos" class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:value={cumplimientos}>
              <option value="">Indicación de Cumplimientos</option>
              {#each estadoDeActivo as estado}
                  <option value={estado}>{estado}</option>
              {/each}
          </select>
      </div>

      <div class="mb-6 col-span-2">
          <label for="comentarios" class="block text-sm font-medium text-gray-100">Comentarios:</label>
          <textarea id="comentarios" class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:value={comentarios}></textarea>
      </div>

  </div>
  <button class="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600" on:click={handleSubmit}>Enviar</button>
</div>

<!-- Tabla para mostrar los datos -->
<table class="mt-4">
  <thead>
      <tr class="text-gray-800 hover:text-blue-200 dark:text-red-800">
          <th>Código Cliente</th>
          <th>Código Activo</th>
          <th>Nombre Activo</th>
          <th>Fecha de Inicio</th>
          <th>Componente a Evaluar</th>
          <th>Nombre de Componente</th>
          <th>Comentarios</th>
          <th>Cumplimientos</th>
      </tr>
  </thead>
  <tbody>
      {#each $activosAnteriores as activo}
      <tr>
          <td>{activo.codigoCliente}</td>
          <td>{activo.codigoActivo}</td>
          <td>{activo.nombreActivo}</td>
          <td>{activo.fecha_creacion}</td>
          <td>{activo.componente}</td>
          <td>{activo.nombreComponente}</td>
          <td>{activo.comentarios}</td>
          <td>{activo.cumplimientos}</td>
      </tr>
      {/each}
  </tbody>
</table>

<style>
  /* Estilos CSS para la Tabla General */
  .formulario {
      max-width: 600px;
      margin: 0 auto;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      background-color: #2b2929; /* Nuevo color de fondo */
  }

  .formulario label {
      display: block;
      margin-bottom: 10px; /* Reducido el margen inferior */
  }

  .formulario input[type="text"],
  .formulario select,
  .formulario textarea {
      width: calc(100% - 20px); /* Ajuste del ancho con margen izquierdo y derecho */
      padding: 8px;
      border: 1px solid #ddd; /* Borde más suave */
      border-radius: 4px;
      margin-bottom: 15px; /* Aumento del margen inferior */
  }

  .formulario button {
      background-color: #007bff;
      color: #fff;
      border: none;
      padding: 12px 24px; /* Aumento del relleno */
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s;
      display: block;
      margin-top: 15px; /* Aumento del margen superior */
  }

  .formulario button:hover {
      background-color: #0056b3;
  }

  table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 20px; /* Aumento del margen superior */
  }

  th,
  td {
      border: 1px solid #ddd;
      padding: 10px; /* Aumento del relleno */
      text-align: left;
  }

  th {
      background-color: #f2f2f2;
      font-weight: bold; /* Texto en negrita para encabezados */
  }

  td {
      background-color: #404040; /* Color de fondo para las celdas de datos */
  }
</style>
