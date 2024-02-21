<script lang="ts">
    // Importar las librerías necesarias y definir las variables
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';  
    import { tablaGeneral, auth, tablaEspecifica } from '../lib/firebase/firebase';
    import { addDoc, onSnapshot } from 'firebase/firestore';

    // Definir las variables
    const componentes = [
        "Cruce", "Desnivel", "Rebaja de vereda", "Estacionamiento", "Entorno",
        "Acceso", "Mesón y area de atención", "Puertas de Acceso/Evacuación",
        "Puertas otros recintos", "Rampas/Planos inclinados", "Escaleras/Escaleras Mecanicas",
        "Servicio Hegiénico", "Evacuación", "Camarín", "Auditoria/Grandes salas"
    ];
    const items = ["General", "Señalización"];

    let componente: string = ''; // Selección de componentes a evaluar
    let nombreComponente: string = ''; // Nombre específico de componentes a evaluar
    let codigoCliente: string = ''; // Variable para el código del cliente
    let codigoActivo: string = ''; // Variable para el código del activo
    let item: string = ''; // Item seleccionado
    let cumplimientos: Record<string, string> = {}; // Opciones de cumplimiento para cada componente
    let comentarios: string = ''; // Comentarios breves
    let nombresComponenteDisponibles: string[] = []; // Nombres de componente disponibles
    let ValidoParaEvaluacion: boolean = true; //

    // Función para cargar los nombres de componente disponibles desde ActivosTG
    async function cargarNombresComponenteDisponibles(componenteSeleccionado: string) {
        try {
            const querySnapshot = await onSnapshot(tablaGeneral, (snapshot) => {
                nombresComponenteDisponibles = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data && data.componente === componenteSeleccionado) {
                        nombresComponenteDisponibles.push(data.nombreComponente);
                    }
                });
            });
        } catch (error) {
            console.error('Error al cargar los nombres de componente disponibles:', error);
        }
    }

    function getUserId() {
        // Verificar si hay un usuario actualmente autenticado
        const currentUser = auth.currentUser;
        return currentUser ? currentUser.uid : null;
    }

    function limpiarFormulario() {
        comentarios = '';
        nombreComponente = '';
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
            componente,
            nombreComponente,
            item,
            comentarios,
            cumplimientos,
            ValidoParaEvaluacion
        };

        try {
            // Agrega los datos del nuevo activo a la colección en Firestore
            await addDoc(tablaEspecifica, nuevoActivo);
            console.log('Datos del activo agregados a Firestore con éxito.');
            limpiarFormulario(); // Limpia los campos del formulario después de agregar el activo
        } catch (error) {
            console.error('Error al agregar los datos del activo a Firestore:', error);
        }
    };
     
    // Función para cargar los activos anteriores desde Firestore y actualizar el store
    async function cargarActivosAnteriores() {
      try {
        const querySnapshot = await onSnapshot(tablaEspecifica, (snapshot) => {
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
   
    // Definir el store para los activos anteriores
    export const activosAnteriores = writable([]);


    onMount(() => { 
        cargarActivosAnteriores();
        cargarNombresComponenteDisponibles(componente);
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
            <label for="componente" class="block text-sm font-medium text-gray-100">Componente:</label>
            <select id="componente" class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:value={componente} on:change={() => cargarNombresComponenteDisponibles(componente)}>
                <option value="">Componente</option>
                {#each componentes as component}
                    <option value={component}>{component}</option>
                {/each}
            </select>
        </div>

        <div class="mb-6">
            <label for="nombreComponente" class="block text-sm font-medium text-gray-100">Nombre Componente:</label>
            <select id="nombreComponente" class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:value={nombreComponente}>
                <option value="">Nombre Componente</option>
                {#each nombresComponenteDisponibles as nombre}
                    <option value={nombre}>{nombre}</option>
                {/each}
            </select>
        </div>
  
        <div class="mb-6">
            <label for="item" class="block text-sm font-medium text-gray-100">Item:</label>
            <select id="item" class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:value={item}>
                <option value="">Item</option>
                {#each items as it}
                    <option value={it}>{it}</option>
                {/each}
            </select>
        </div>
  
        <div class="mb-6 col-span-2">
            <label for="comentarios" class="block text-sm font-medium text-gray-100">Comentarios:</label>
            <textarea id="comentarios" class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:value={comentarios}></textarea>
        </div>
  
    </div>
    <!-- Nuevo campo para ValidoParaEvaluacion -->
    <div class="mb-6">
        <label for="validoParaEvaluacion" class="block text-sm font-medium text-gray-100">Válido Para Evaluación:</label>
        <input type="checkbox" id="validoParaEvaluacion" class="mt-1 p-2 w-full border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:checked={ValidoParaEvaluacion}>
    </div>
  
    <button class="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600" on:click={handleSubmit}>Enviar</button>
</div>



  
  <!-- Tabla para mostrar los datos  -->
  <table class="mt-4">
    <thead>
        <tr class="text-gray-800 dark:text-red-800">
            <th>Código Cliente</th>
            <th>Código Activo</th>
            <th>Fecha de Inicio</th>
            <th>Componente a Evaluar</th>
            <th>Nombre de Componente</th>
            <th>Comentarios</th>
            <th>Estado de validación</th>

        </tr>
    </thead>
    <tbody>
        {#each $activosAnteriores as activo}
        <tr class="{activo.ValidoParaEvaluacion ? 'bg-green-800' : 'bg-red-800'}">
            <td>{activo.codigoCliente}</td>
            <td>{activo.codigoActivo}</td>
            <td>{activo.fecha_creacion}</td>
            <td>{activo.componente}</td>
            <td>{activo.nombreComponente}</td>
            <td>{activo.comentarios}</td>
            <td>{activo.ValidoParaEvaluacion}</td>
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
  
    /* Cambio de color de fondo para filas con ValidParaEvaluacion = false */
  </style>
  
