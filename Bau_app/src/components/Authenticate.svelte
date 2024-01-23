<script>
    import {authHandlers} from "../store/store"

    let email = "";
    let password = "";
    let error = false;
    let register = false;
    let authenticating = false;

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

</script>



<div class="AuthContainer">
    <form>
        <h1>Login</h1>
        {#if error}
            <p class="error">Credenciales ingresadas son incorrectas</p>
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