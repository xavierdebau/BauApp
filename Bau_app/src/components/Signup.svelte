<script>
    import { authHandlers } from "../store/store";
    import { users } from "../lib/firebase/firebase"; // Assuming 'users' is a Firestore collection reference
    import { onMount } from 'svelte';
    import { onSnapshot } from 'firebase/firestore'; // Import onSnapshot for listening to collection changes

    let email = "";
    let password = "";
    let confirmPassword = "";
    let userType = "";
    let error = "";
    let userList = []; // Store user list

    const userTypes = ["administrador", "técnico", "regular"]; // Available user types

    async function handleSignup() {
        if (!validateForm()) return;

        try {
            await authHandlers.signup(email, password, userType);
            clearForm();
        } catch (error) {
            console.error('Error in user signup:', error);
            setError("Error creating user. Please try again later.");
        }
    }

    function validateForm() {
        if (!email || !password || !confirmPassword || !userType) {
            setError("Please fill in all fields.");
            return false;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return false;
        }

        return true;
    }

    function clearForm() {
        email = "";
        password = "";
        confirmPassword = "";
        userType = "";
        setError("");
    }

    function setError(message) {
        error = message;
    }

    async function cargarUsers() {
        try {
            const querySnapshot = await onSnapshot(users, (snapshot) => {
                const users = [];
                snapshot.forEach((doc) => {
                    users.push({ id: doc.id, ...doc.data() });
                });
                userList = users; // Update userList
            });
        } catch (error) {
            console.error('Error al cargar los usuarios:', error);
        }
    }

    // Load users on mount
    onMount(() => {
        cargarUsers();
    });
</script>

<style>
    .AuthContainer input,
    .AuthContainer select {
        color: black;
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

<!--Formulari de creacion de ususario-->
<div class="AuthContainer">
    <form class="w-full max-w-sm">
        <h1 class="text-xl font-bold mb-4">Registrar nuevo usuario</h1>
        {#if error}
            <p class="text-red-500">{error}</p>
        {/if}
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
                Email:
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={email} type="email" placeholder="Email"/> 
            </label>
        </div>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
                Contraseña:
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={password} type="password" placeholder="Contraseña"/>
            </label>
        </div>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
                Confirme contraseña:
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={confirmPassword} type="password" placeholder="Confirme contraseña"/>
            </label>
        </div>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
                Seleccione tipo de usuario 
                <select class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={userType} placeholder="Select User Type">
                    <option value="">Tipo de usuario</option>
                    {#each userTypes as type}
                        <option value={type}>{type}</option>
                    {/each}
                </select>
            </label>
        </div>
        <div class="mb-6">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" on:click={handleSignup} type="button">Registrar</button>
        </div>
    </form>
</div>


<!-- Display users table -->
<div class="mt-8">
    <h2 class="text-xl font-bold mb-4">Usuarios Registrados</h2>
    <table class="min-w-full">
        <thead>
            <tr class="text-gray-800 hover:text-blue-200 dark:text-red-800">
                <th class="px-4 py-2">Email</th>
                <th class="px-4 py-2">Tipo</th>
            </tr>
        </thead>
        <tbody>
            {#each userList as user}
                <tr>
                    <td class="px-4 py-2">{user.email}</td>
                    <td class="px-4 py-2">{user.userType}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
