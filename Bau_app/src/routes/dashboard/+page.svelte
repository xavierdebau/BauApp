
<script>
    let datalist = ['hola soy un dato de prueba'];
</script>

<div class="mainContainer">
    <div class="headerContainer">
        <h1>Ingresaste de forma correcta</h1>
        
    </div>
    <main>
        {#each datalist as data,index }
        <div class="data">
            {index+1}.{data}
        </div>
            
        {/each}    
        <h1>Form data</h1>

        <button>Save</button>
        <div class='dataContainer'>
            <input type="text" placeholder="Ingresa texto"/>
            <button>add</button>
        </div>

    </main>
</div>



<style>
    .mainContainer{
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        gap: 100px;
        padding: 15px;
        width: 100%;
        max-width: fit-content;
        margin: 0 auto;

    }
    .headerContainer {
        display: flex;
        align-items: center;
        justify-content: space-between;

    }
    .dataContainer{
        display: flex;
        align-items: stretch;

    }
    .dataContainer input{
        background: lightskyblue;
        border: snow;
        padding: 14px;
        color: white;
        flex: 1 1 auto;
    }


    main {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: auto;
        gap: 14px;
        padding: 14px;

    }
</style>