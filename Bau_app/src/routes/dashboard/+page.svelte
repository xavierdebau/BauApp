<script>
    import Signup from "../../components/Signup.svelte";
    import TablaGeneral from "../../components/TablaGeneral.svelte";
    import TablaId from "../../components/TablaID.svelte";
    import TablaEspecifica from "../../components/TablaEspecifica.svelte";
    import Header from "../../components/Header.svelte";
    import {AppRail, AppRailTile, AppRailAnchor } from '@skeletonlabs/skeleton';

    import {auth} from '../../lib/firebase/firebase';
    import { getFirestore, doc, getDoc } from 'firebase/firestore';
    
    let userType = '';
    let showAdminTiles = false; 

    async function getUserInfo(uid) {
        try {
            const db = getFirestore();
            const userRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                return userDoc.data();
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error al obtener la información del usuario:', error);
            return null;
        }
    }


        // Función para manejar el cambio en el estado de autenticación
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            // El usuario está autenticado
            const userInfo = await getUserInfo(user.uid);
            userType = userInfo ? userInfo.userType : null;
            console.log(userType);
            
            // Una vez que se ha determinado el userType, actualiza la visibilidad de los tiles
            if (userType === 'administrador') {
                // Permitir la visualización de los tiles de Signup y ID
                showAdminTiles = true;
            } else {
                // No permitir la visualización de los tiles de Signup y ID
                showAdminTiles = false;
            }
        } else {
            // No hay usuario autenticado
            console.log('No hay usuario autenticado.');
        }
    });


    
    let currentTile = 1; // Initialize the current tile index

    // Function to handle the change of the active tile
    function handleTileChange(newValue) {
        currentTile = newValue;
    }

</script>
<Header/>

<div class="mainContainer">
    <div class="contentContainer">
        <div class="railContainer">
            <!-- App Rail tiles for different sections -->
            <div class="railTiles">
                {#if showAdminTiles}
                    <AppRailTile bind:group={currentTile} name="signup" value={0} title="Signup" on:click={() => handleTileChange(0)}>
                        <span class:selected={currentTile === 0} slot="lead">(icon)</span>
                        <span class:selected={currentTile === 0}>Signup</span>
                    </AppRailTile>
                    <div class="divider"></div>
                    <AppRailTile bind:group={currentTile} name="tablaId" value={1} title="ID" on:click={() => handleTileChange(1)}>
                        <span class:selected={currentTile === 1} slot="lead">(icon)</span>
                        <span class:selected={currentTile === 1}>ID</span>
                    </AppRailTile>
                    <div class="divider"></div>
                {/if}
                <AppRailTile bind:group={currentTile} name="tablaGeneral" value={2} title="General" on:click={() => handleTileChange(2)}>
                    <span class:selected={currentTile === 2} slot="lead">(icon)</span>
                    <span class:selected={currentTile === 2}>General</span>
                </AppRailTile>
                <div class="divider"></div>
                <AppRailTile bind:group={currentTile} name="tablaEspecifica" value={3} title="Especifica" on:click={() => handleTileChange(3)}>
                    <span class:selected={currentTile === 3} slot="lead">(icon)</span>
                    <span class:selected={currentTile === 3}>Especifica</span>
                </AppRailTile>
            </div>
            
        </div>
        <div class="content">
            <!-- Content based on the active tile -->
            {#if currentTile === 0}
                <Signup/> <!-- Signup Component -->
            {:else if currentTile === 1}
                <TablaId/> <!-- TablaID Component -->
            {:else if currentTile === 2}
                <TablaGeneral/> <!-- TablaGeneral Component -->
            {:else if currentTile === 3}
                <TablaEspecifica/> <!-- TablaESpecifica Component -->
            {/if}
        </div>
    </div>
</div>

<style>
.mainContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 15px;
}

.contentContainer {
    display: flex;
    flex: 1;
    justify-content: space-between; /* Align items to the sides */
    width: 100%;
    max-width: 800px;
}

.content {
    width: 70%; /* Adjust width of content as needed */
}

.railContainer {
    background-color: #333; /* Dark gray background color */
    padding: 10px; /* Adjust padding as needed */
    width: 30%; /* Adjust width of rail as needed */
}


/* Styling for selected tile */
.selected {
    background-color: lightblue;
    color: #333; /* Dark letters */
}
.railTiles {
    display: flex;
    flex-direction: column;
    gap: 10px; /* Adjust the space between tiles */
}

.divider {
    height: 1px;
    background-color: #ccc; /* Adjust the color of the division */
    margin: 5px 0; /* Adjust the margin to control the space around the divider */
}
</style>
