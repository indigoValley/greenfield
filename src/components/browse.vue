<template>
    <b-container>
        <br>
        <b-row>
            <b-col>
                <input v-model="query" placeholder="find a potluck">
                <b-button size="sm" variant="outline-warning" :query="query" v-on:click="search(query)">
                Search
                </b-button>
                <br>
                <br>
                PotLuckies
                <ul>
                    <li v-for="pot in potLuckies">{{pot.Name}}</li>
                </ul>
            </b-col>
            <b-col>
                <div class="google-map" :id="mapName"></div>
            </b-col>
        </b-row>
    </b-container>
</template>
<script>
window.clickMe = () => {
   return;
}
import mapMarkerData from './marker.vue';
export default {
    components: {
        mapMarkerData: mapMarkerData,
    },
    name: 'google-map',
    props: ['name'],
    data: function() {
        return {
            mapName: this.name + "-map",
            markerCoordinates: [{
                latitude: 29.9511,
                longitude: -90.0715
            }],
            map: null,
            bounds: null,
            markers: [],

            potLuckies: [],
            query:'',
        }
    },
    methods:{
        search: function(query) {
            this.potLuckies.push(query)
            this.$http.get('/browse')
                .then(response => {
                    let matches = response.body.filter(event => event.Name.toLowerCase().includes(query.toLowerCase()));
                    this.potLuckies = matches;
                    this.getMapPoints(this.potLuckies);
                    console.log('matches', matches)
                })
        },
        getMapPoints: function(events) {
            this.markerCoordinates = [{
                latitude: 29.9511,
                longitude: -90.0715
            }];
            this.bounds = new google.maps.LatLngBounds();
            const element = document.getElementById(this.mapName)
            const mapCentre = this.markerCoordinates[0]
            const options = {
                center: new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude)
            }
            this.map = new google.maps.Map(element, options);
            const context = this;
            let arr = [];
            events.forEach(function(element) {
                let tempLat = element.LocationLat;
                let tempLong = element.LocationLng;
                let eventInfo = element;
                arr.push({ latitude: tempLat, longitude: tempLong, event: eventInfo })
            });
            arr.forEach((coord) => {
                const position = new google.maps.LatLng(coord.latitude, coord.longitude);
                var contentString = 
                '<div>' +
                '<h2>' + `${coord.event.Name}` + '</h2>' +
                '<p>' + 'Host: ' + `${coord.event.Host}` + '</p>' +
                '<p>' + 'Address: ' + `${coord.event.Address}` + '</p>' +
                '<button id="request" onclick="window.clickMe()">Click me</button>' +
                '</div>'
                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });
                var marker = new google.maps.Marker({
                    position,
                    map: this.map,
                    event: coord.event,
                });
    
                marker.addListener('click', function() {
                    infowindow.open(this.map, marker);
                    let message = document.getElementById('request');
                    message.addEventListener('click', () => {
                        context.$http.post('/request', {
                            name: marker.event.Name,
                        }).then(function(response) {
                            socket.emit('request', {
                                eventName: marker.event.Name,
                            })
                            console.log(response);
                        })
                    
                        });
    
                });
                this.markers.push(marker)
                this.map.fitBounds(this.bounds.extend(position))
    
            });

        },
    },

    mounted: function() {
        const socket = io.connect();
        this.$http.get('/browse')
            .then(function(response) {
                this.potLuckies = response.body;
                this.getMapPoints(this.potLuckies);
            })

        }
};
</script>
<style scoped>
.google-map {
    width: 700px;
    height: 500px;
    margin: 0 auto;
    background: gray;
}
</style>