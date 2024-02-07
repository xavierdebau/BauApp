<script>
    import { authHandlers } from "../store/store";
    import { onMount } from 'svelte';

    let email = "";
    let password = "";
    let confirmPassword = "";
    let userType = "";
    let error = "";

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
</script>
<style>
    .AuthContainer input,
    .AuthContainer select {
        color: black;
    }
</style>
<div class="AuthContainer">
    <form>
        <h1>Registrar nuevo usuario</h1>
        {#if error}
            <p class="error">{error}</p>
        {/if}
        <label>
            <input bind:value={email} type="email" placeholder="Email"/> 
        </label>
        <label>
            <input bind:value={password} type="password" placeholder="Password"/>
        </label>
        <label>
            <input bind:value={confirmPassword} type="password" placeholder="Confirm Password"/>
        </label>
        <label>
            <select bind:value={userType} placeholder="Select User Type">
                <option value="">Select User Type</option>
                {#each userTypes as type}
                    <option value={type}>{type}</option>
                {/each}
            </select>
        </label>
        <button on:click={handleSignup} type="button">Register</button>
    </form>
</div>
