<script>
    let user_name = "";
    let password = "";
    let error = false;

    function handleAuth(){
        if (!user_name || !password){
            error = true;
            return;
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
             <input bind:value={user_name} type="user_name" placeholder="nombre"/> 
        </label>
        <label>
            <input bind:value={password} type="password" placeholder="contraseña"/>
        </label>
        <button type="submit" >ingresar</button>
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