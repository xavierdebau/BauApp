
<script>
    import {authHandlers} from "../../store/store";
    import Signup from "../../components/Signup.svelte";
	import FormTabla from "../../components/FormTabla.svelte";
    import TablaID from "../../components/TablaID.svelte";
    import TablaGeneral from "../../components/TablaGeneral.svelte"
    import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
	import TablaId from "../../components/TablaID.svelte";
    let activeTab = 1;
    // Función para manejar el cambio de pestaña
    function handleTabChange(newValue) {
        activeTab = newValue;
    };

</script>
<div class="mainContainer">
    <div class="headerContainer">
        <h1>Welcome</h1>
        <button on:click={authHandlers.logout}>Logout</button>
       
    </div>
    <main> 
         <!-- Componente TabGroup -->
        <TabGroup bind:tabSet={activeTab}>
            <!-- Componente Tab para la pestaña Signup -->
            <Tab bind:group={activeTab} name="signup" value={0}>
            <svelte:fragment slot="lead">(icon)</svelte:fragment>
            <span>Signup</span>
            </Tab>
            <!-- Componente Tab para la pestaña FormTabla -->
            <Tab bind:group={activeTab} name="TablaID" value={1}>
            <svelte:fragment slot="lead">(icon)</svelte:fragment>
            <span>ID</span>
            </Tab>
            <!-- Contenido de las pestañas -->
            <svelte:fragment slot="panel">
            {#if activeTab === 0}
                <Signup/> <!-- Componente Signup -->
            {:else if activeTab === 1}
                <TablaId/> <!-- Componente FormTabla -->
            {/if}
            </svelte:fragment>
        </TabGroup>
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