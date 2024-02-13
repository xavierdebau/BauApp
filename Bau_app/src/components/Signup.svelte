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

    const userTypes = ["admin", "technician", "regular"]; // Available user types

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
                Password:
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={password} type="password" placeholder="Password"/>
            </label>
        </div>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
                Confirm Password:
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={confirmPassword} type="password" placeholder="Confirm Password"/>
            </label>
        </div>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
                Select User Type:
                <select class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" bind:value={userType} placeholder="Select User Type">
                    <option value="">Select User Type</option>
                    {#each userTypes as type}
                        <option value={type}>{type}</option>
                    {/each}
                </select>
            </label>
        </div>
        <div class="mb-6">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" on:click={handleSignup} type="button">Register</button>
        </div>
    </form>
</div>


<!-- Display users table -->
<div class="mt-8">
    <h2 class="text-xl font-bold mb-4">Usuarios Registrados</h2>
    <table class="min-w-full">
        <thead>
            <tr>
                <th class="px-4 py-2">Email</th>
                <th class="px-4 py-2">User Type</th>
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
