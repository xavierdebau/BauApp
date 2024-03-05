<script lang="ts">
    // Importar las librerías necesarias y definir las variables
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';  
    import { tablaGeneral, auth, tablaEspecifica } from '../lib/firebase/firebase';
    import { addDoc, onSnapshot, doc, deleteDoc} from 'firebase/firestore';

// Definir las variables estaticas para respuesta de formulario
    const componentes = [
        "Cruce", "Desnivel", "Rebaja de vereda", "Estacionamiento", "Entorno",
        "Acceso", "Mesón y area de atención", "Puertas de Acceso/Evacuación",
        "Puertas otros recintos", "Rampas/Planos inclinados", "Escaleras/Escaleras Mecanicas",
        "Servicio Hegiénico", "Evacuación", "Camarín", "Auditoria/Grandes salas"
    ];

    const items = ["General", "Señalización"];

    const N_EST = ["N -4.1.7 NUM 5","N -4.1.7 NUM 5","N -4.1.7 NUM 5","N -4.1.7 NUM 5","N -4.1.7 NUM 5",
                    "MANUAL DE SEÑALIZACIÓN DE TRÁNSITO. DTO 78","MANUAL DE SEÑALIZACIÓN DE TRÁNSITO. DTO 78"];

    let nombresComponenteDisponibles: string[] = []; // Nombres de componente disponibles


//elementos de formulario
    let componente: string = ''; // Selección de componentes a evaluar
    let nombreComponente: string = ''; // Nombre específico de componentes a evaluar
    let codigoCliente: string = ''; // Variable para el código del cliente
    let codigoActivo: string = ''; // Variable para el código del activo
    let nivel: string = ''; // Variable para el nivel en el que se encuentra el componente
    let sector: string = ''; //Variable para el sector en el que se encuentra el componente
    let item: string = ''; // Item seleccionado
    let norma: string = ''; // Normativa seleccionada(estacionamientos)
    let estadoNorma: boolean = true; // Valor de la norma
    let comentarios: string = ''; // Comentarios breves
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
            nivel,
            sector,
            componente,
            nombreComponente,
            item,
            norma,
            estadoNorma,
            comentarios,
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
    // Función para borrar un elemnto
    async function handleDelete(id: string) {
        try {
            await deleteDoc(doc(tablaEspecifica, id));
            console.log('Activo eliminado con éxito.');
        } catch (error) {
            console.error('Error al eliminar el activo:', error);
        }
    }

     
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
            <label for="nivel" class="block text-sm font-medium text-gray-100">Nivel:</label>
            <input type="text" id="nivel" class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:value={nivel}>
        </div>
        <div class="mb-6">
            <label for="sector" class="block text-sm font-medium text-gray-100">Sector:</label>
            <input type="text" id="sector" class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:value={sector}>
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

        <div class="mb-6">
            <label for="norma" class="block text-sm font-medium text-gray-100">Normativa:</label>
            <select id="norma" class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:value={norma} on:change={() => cargarNombresComponenteDisponibles(componente)}>
                <option value="">Norma</option>
                {#each N_EST as normativa}
                    <option value={normativa}>{normativa}</option>
                {/each}
            </select>
        </div>
        <div class="mb-6">
            <label for="estadoNorma" class="block text-sm font-medium text-gray-100">Estado norma:</label>
            <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" id="validoParaEvaluacion" name="estadoNorma" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" bind:checked={estadoNorma}>
                <label for="estadoNorma" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
        </div>
  
        <div class="mb-6 col-span-2">
            <label for="comentarios" class="block text-sm font-medium text-gray-100">Comentarios:</label>
            <textarea id="comentarios" class="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black" bind:value={comentarios}></textarea>
        </div>
  
    </div>
    <!-- Nuevo campo para ValidoParaEvaluacion -->
    <div class="mb-6">
        <label for="validoParaEvaluacion" class="block text-sm font-medium text-gray-100">Válido Para Evaluación:</label>
        <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input type="checkbox" id="validoParaEvaluacion" name="validoParaEvaluacion" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" bind:checked={ValidoParaEvaluacion}>
            <label for="validoParaEvaluacion" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
        </div>
    </div>
    
  
    <button class="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600" on:click={handleSubmit}>Enviar</button>
</div>
  
  <!-- Tabla para mostrar los datos  -->
  <table class="mt-4">
    <thead>
        <tr class="text-gray-800 dark:text-red-800">
            
            <th>Nivel</th>
            <th>Sector</th>
            <th>Componente a Evaluar</th>
            <th>Nombre de Componente</th>
            <th>Norma</th>
            <th>Estado de Norma</th>
            <th>Comentarios</th>
            

        </tr>
    </thead>
    <tbody>
        {#each $activosAnteriores as activo}
        <tr class="{activo.ValidoParaEvaluacion ? 'bg-green-800' : 'bg-red-800'}">       
            <td>{activo.nivel}</td>
            <td>{activo.sector}</td>
            <td>{activo.componente}</td>
            <td>{activo.nombreComponente}</td>
            <td class="{activo.estadoNorma ? 'bg-green-800' : 'bg-red-700'}">{activo.norma}</td>
            <td class="{activo.estadoNorma ? 'bg-green-800' : 'bg-red-700'}">{activo.estadoNorma}</td>
            <td>{activo.comentarios}</td>

            <td>
                <button class="bg-red-500 text-white px-2 py-1 rounded-md transition duration-300 ease-in-out hover:bg-red-600" on:click={() => handleDelete(activo.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                    </svg>
                </button>
            </td>
            
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
  
