<script>
    import { authHandlers } from "../store/store";
    import { onMount } from 'svelte';

    let email = "";
    let password = "";
    let confirmPassword = "";
    let userType = ""; // Variable to store selected user type
    let error = false;
    let authenticating = false;

    const userTypes = ["admin", "technician", "regular"]; // Available user types

    async function handleSignup() {
        if (authenticating) {
            return;
        }
        
        if (!email || !password || !confirmPassword || !userType) {
            error = true;
            return;
        }

        if (password !== confirmPassword) {
            error = true;
            return;
        }

        authenticating = true;
        
        try {
            await authHandlers.signup(email, password, userType);
        } catch (error) {
            console.error('Error in user signup:', error);
            error = true;
        }
    }
</script>

<div class="AuthContainer">
    <form>
        <h1>Register</h1>
        {#if error}
            <p class="error">Incorrect credentials provided.</p>
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
