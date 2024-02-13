<script>
    // Import the logo image
    import logo from '../static/BAU_logo_b.png';  
    import { authHandlers } from "../store/store";
</script>

<style>
     /* Style for the AppBar component */
     .appbar {
        background-color: #ffffff; /* Change the color to your desired background color */
        color: #fff; /* Change the color to your desired text color */
        padding: 20px; /* Add padding as needed */
        display: flex;
        align-items: center; /* Align items to the start and end */
    }
    /* Style for the logo image */
    .logo {
        width: 200px; /* Adjust the width of the logo as needed */
        height: auto;
    }

    button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 20px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #0056b3;
    }
    
</style>

<header class="appbar grid grid-cols-2 gap-4 place-content-between">
        <!-- Use the imported logo variable as src -->
            <div><img src={logo} alt="Logo" class="logo"/></div>
            <div><button on:click={authHandlers.logout}>Logout</button></div>
</header>
