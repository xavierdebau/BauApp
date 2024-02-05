
<script>
    import {authHandlers} from "../../store/store";
    import Signup from "../../components/Signup.svelte";
	import FormTabla from "../../components/FormTabla.svelte";

</script>
<div class="mainContainer">
    <div class="headerContainer">
        <h1>Welcome</h1>
        <button on:click={authHandlers.logout}>Logout</button>
       
    </div>
    <main> 
        <Signup/>
        <FormTabla/>
    </main>
</div>

<style>
    .mainContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100vh;
        padding: 15px;
    }

    .headerContainer {
        width: 100%;
        max-width: 800px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #0056b3;
    }

    

    main {
        width: 100%;
        max-width: 800px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    h1{
        margin: 0;
        font-weight: normal;
    }

</style>