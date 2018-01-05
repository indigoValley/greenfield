<template>
    <div class="row">
        <div class="col-sm-12">
            <b-nav class="topnav" id="myTopnav">
                <h4>PotLucky</h4>
                <router-link to="/">Home</router-link>
                <router-link to="/profile">Dashboard</router-link>
                <router-link to="/login">Login/signup</router-link>
                <router-link to="/browse">Browse</router-link>
                <router-link to="/create">Create</router-link>
            </b-nav>

        </div>
        

    </div>
</template>

<script>
// Imports
export default {
    data() {
        return {

        }
    },
    methods: {

    }
}
</script>

<style scoped>
.topnav {
    background-color: rgba(247, 111, 48, 0.781);
    overflow: hidden;
   padding-top: 40px; 
    
}

/* Style the links inside the navigation bar */
.topnav a {
    float: left;
    display: block;
    color: #f2f2f2;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    font-size: 17px;
}

h4 {
    color: #f2f2f2;
    padding: 14px 16px;
}

/* Change the color of links on hover */
.topnav a:hover {
    background-color: rgb(240, 104, 41);
    color: black;
}

/* Add a color to the active/current link */
.topnav a.active {
    background-color: #4CAF50;
    color: white;
}

</style>