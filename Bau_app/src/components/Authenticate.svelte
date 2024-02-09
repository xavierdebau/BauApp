<script>
    import {authHandlers} from "../store/store";

    let email = "";
    let password = "";
    let error = false;
    let register = false;
    let authenticating = false;
    let reset = false;
    

    async function handleAuth(){
        if (authenticating) {
            return;
        }
       
        if (!email || !password || (register && confirmPassword)){
            error = true;
            return;
        } 
        authenticating = true;
        try {
            if (!register){
             let demo =  await authHandlers.login(email, password);
             return error = true;
            }
        } catch (error) {
            console.log('error en autenticacion',error);
            error = true;
            return;
        }

    }
    async function handlePasswordReset() {
        try {
            await authHandlers.resetPassword(email); // Assuming email is bound to the input field
            // Provide feedback to the user indicating that the reset email has been sent
            console.log('Password reset email sent successfully.');
            reset = true;
        } catch (error) {
            // Handle errors, such as displaying an error message to the user
            console.error('Error sending password reset email:', error.message);
        }
    }

</script>


<style>
    .AuthContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;  
    }

    .AuthContainer input{
        color: black;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 400px;
        max-width: 100%;
        margin: 0 auto;
    }

    form input {
        width: 100%;
    }

    form input:focus {
        border: none;
        outline: 1px solid #013200;
    }

    form button {
        background: whitesmoke;
        color: black;
    }

    form button:hover {
        background: rgb(43, 43, 202);
        color: white;
    }
</style>

<div class="AuthContainer flex justify-center items-center h-screen">
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 class="text-center text-xl font-bold mb-4">Login</h1>
        {#if error}
            <p class="text-red-500 text-xs italic">Credenciales ingresadas son incorrectas</p>
            <button class="text-blue-500 hover:text-blue-800" on:click={handlePasswordReset} type="button">Olvidaste tu contraseña ?</button>
            {#if reset}
                <p>se envió un mail con un link para reestablecer su contraseña</p>
            {/if}
        {/if}
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                Email
            </label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="email" bind:value={email}>
        </div>
        <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                Contraseña
            </label>
            <input class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" bind:value={password}>
        </div>
        <div class="flex items-center justify-between">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" on:click={handleAuth} type="button">
                Ingresar
            </button>
        </div>
    </form>
</div>
