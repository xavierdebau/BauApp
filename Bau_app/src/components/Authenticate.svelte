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
                await authHandlers.login(email, password);
            }
        } catch (error) {
            console.log('error en autenticacion',error);
            error = true;
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



<div class="AuthContainer">
    <form>
        <h1>Login</h1>
        {#if error}
            <p class="error">Credenciales ingresadas son incorrectas</p>
            <button on:click={handlePasswordReset} type="button">Forgot Password?</button>
            {#if reset}
                <p>se envio un mail con un link para reestablecer su contraseña</p>
            {/if}
        {/if}
        <label>
             <input bind:value={email} type="email" placeholder="email"/> 
        </label>
        <label>
            <input bind:value={password} type="password" placeholder="contraseña"/>
        </label>
        <button on:click={handleAuth} type="button" >ingresar</button>
    </form>
</div>   

<style>
    .AuthContainer{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 400px;
        max-width: 100%;
        margin: 0 auto;
    }
    form input{
        width: 100%;
    }
    form input:focus {
        border: none;
        outline: 1px solid #013200
    }
    form button{
        background: whitesmoke;
        color: black
    }
    form button:hover {
        background: rgb(43, 43, 202);
        color: white
    }
    .error { color: coral;}
</style>