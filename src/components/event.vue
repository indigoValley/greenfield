<template>
    <b-container id="Event">
        <!-- ----------------------------NEW STUFF------------------------ -->
        <div class="row">
            <div class="col-sm-3"></div>
            <div class="col-sm-5"><h1>{{event.Name}}</h1></div>
            <div class="col-sm-3">
                <b-btn id="show-modal" @click="showModal = true" style="background-color: rgba(247, 111, 48, 0.781); float: right;">Event Chat</b-btn>
                <chat v-if="showModal" v-bind:event='event' v-bind:name='name' @close="showModal = false">
                    <h3 slot="header">{{event.Name}}</h3>
                </chat>
            </div>
        </div>
        <br>
        <div class="row">
            <div class="col-sm-3">
                <p>Date: {{event.Date}}</p>
                <p>Time: {{event.Time}}</p>
                <p>Location: {{event.Address}}</p>
                <p>Recipe: {{meal.label}}</p>
                <ul>
                    <li v-for="Ingredient in meal.ingredientLines" v-bind:key="Ingredient.id">{{Ingredient}}</li>
                </ul>
            </div>
            <div class="col-sm-3">
                <p>Host: {{event.Host}}</p>
                <p>Guests:</p>
                <ul v-if="event.Contributor_List">
                    <li v-for="guest in event.Contributor_List.split(' ')" v-bind:key="guest">
                        {{guest}}
                        <br>
                        <button class="btn btn-sm btn-success" v-if="!isFriend(guest)" id="addFriend" @click="addFriend(guest)">Add Friend</button>
                    </li>
                </ul>
            </div>
            <div class="col-sm-6">
                <template>
                    <div class="google-map" :id="mapName"></div>
                </template>
            </div>
        </div>
    </b-container>
</template>

<script>
// Imports
import chat from './chatBox.vue';
import mapMarkerData from './marker.vue';
export default {
    components: {
        chat: chat,
        mapMarkerData: mapMarkerData,
    },
    name: 'google-map',
    props: ['event', 'name', 'addFriend', 'isFriend'],
    data() {
        return {
            meal: '',
            mapName: this.name + "-map",
            markerCoordinates: [{
                latitude: this.event.LocationLat,
                longitude: this.event.LocationLng,
            }],
            map: null,
            bounds: null,
            markers: [],
            showModal: false,
            data: {
                name: 'test Page'
            }


        }
    },
    mounted: function() {
        this.bounds = new google.maps.LatLngBounds();
        const element = document.getElementById(this.mapName)
        const mapCentre = this.markerCoordinates[0]
        const options = {
            center: new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude),
            maxZoom: 16,
        }
        this.map = new google.maps.Map(element, options);




        this.markerCoordinates.forEach((coord) => {
            console.log(coord)
            const position = new google.maps.LatLng(coord.latitude, coord.longitude);

            var contentString =
                '<div>' +
                '<h2>' + `${this.event.Name}` + '</h2>' +
                '<p>' + 'Host: ' + `${this.event.Host}` + '</p>' +
                '<p>' + 'Address: ' + `${this.event.Address}` + '</p>' +
                '</div>'



            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });


            var marker = new google.maps.Marker({
                position,
                map: this.map,
                title: this.event.name
            });
            marker.addListener('click', function() {
                infowindow.open(this.map, marker);
            });
            this.markers.push(marker)
            this.map.fitBounds(this.bounds.extend(position))
        });


    },
    
    created() {
        this.$http.get('https://api.edamam.com/search?r=http://www.edamam.com/ontologies/edamam.owl%23' + this.event.RecipeID,
            {
                headers: {
                    app_id: '139d20f8',
                    app_key: '1e57cc13913854b044ea52a9fcfdf57d'
                }
            }).then(function(response) {
                this.meal = response.body[0];
            });
            
        },
    methods: {
        
    }
}
</script>

<style scoped>
.google-map {
    width: 500px;
    height: 400px;
    margin: 0 auto;
    background: gray;
}
</style>