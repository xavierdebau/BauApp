
<script>
    import {authHandlers} from "../../store/store";
    import Signup from "../../components/Signup.svelte";
    let datalist = [];

</script>
<div class="mainContainer">
    <div class="headerContainer">
        <h1>Welcome</h1>
        <button on:click={authHandlers.logout}>Logout</button>
       
    </div>
    <main> 
        <Signup/>
        {#each datalist as data, index }
            <div class="data">
                {index + 1}.{data}
            </div>
        {/each}    
        <h1>Form data</h1>

        <div class='dataContainer'>
            <input type="text" placeholder="Enter text"/>
            <button>Add</button>
        </div>
        <button>Save</button>
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

    .dataContainer {
        display: flex;
        align-items: stretch;
        margin-bottom: 20px;
    }

    .dataContainer input {
        background-color: lightskyblue;
        border: none;
        padding: 14px;
        color: white;
        flex: 1;
        border-radius: 5px 0 0 5px;
    }

    .dataContainer button {
        background-color: #28a745;
        color: white;
        border: none;
        padding: 14px;
        border-radius: 0 5px 5px 0;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .dataContainer button:hover {
        background-color: #218838;
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

    .data {
        background-color: #f0f0f0;
        padding: 10px;
        border-radius: 5px;
    }
</style>