<template>
    <b-container>
        <br>
        <b-row>
            <b-col>
                <input v-model="query" placeholder="find a potlucky">
                <b-button size="sm" variant="warning" :query="query" v-on:click="search(query)">
                Search
                </b-button>
                <br>
                <br>
                <h2>PotLuckies</h2>
                <div v-for="(pot, index) in potLuckies">
                    <b-card>
                        <span><h4>{{pot.Name}}</h4></span>
                        <small>{{pot.Date}}&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;{{pot.Time}}</small><br>
                        <b-row>
                            <b-col cols="3">
                                <strong>Host : </strong><br>
                                <strong>Location : </strong><br>
                                <strong>Zip code : </strong><br>
                            </b-col>
                            <b-col>
                                <span>{{pot.Host}}</span><br>
                                <a href="javascript:;" v-on:click="getMapPoints([pot])">{{pot.Address}}</a><br>
                                <!-- <button type="button" class="btn btn-link btn-sm" v-on:click="getMapPoints([pot])">{{pot.Address}}</button><br> -->
                                <!-- <span>{{pot.Address}}</span><br> -->
                                <span>{{pot.Zip_Code}}</span><br>
                            </b-col>
                        </b-row>
                        <!-- <button class="btn btn-sm btn-info" id="showguests" v-on:click="console.log('toggle guests')">guestlist</button> -->
                        <button class="btn btn-sm btn-success" id="request" style="float: right;" v-on:click="clickMe(pot)">attend</button>
                    </b-card>
                </div>
            </b-col>
            <b-col>
                <div style="position: fixed;">
                    <div class="google-map" :id="mapName"></div>

                </div>
            </b-col>
        </b-row>
    </b-container>
</template>
<script>
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
            reqSent: false,
        }
    },
    methods:{
        clickMe: function(event) {
            this.reqSent = true;
            const socket = io.connect();
            console.log('clicked');
            this.$http.post('/request', {
                name: event.Name,
            }).then(function(response) {
                socket.emit('request', {
                    eventName: event.Name,
                })
                console.log(response);
            })
            return;
        },
        search: function(query) {
            this.$http.get('/browse')
                .then(response => {
                    let matches = response.body.filter(event => event.Name.toLowerCase().includes(query.toLowerCase()));
                    this.potLuckies = matches.sort((a, b) => {
                        let A = a.Date.split('-').join('');
                        let B = b.Date.split('-').join('');
                        return A > B ? 1 : A < B ? -1 : 0;
                    });
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
                    const socket = io.connect();
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
                this.potLuckies = response.body.sort((a, b) => {
                        let A = a.Date.split('-').join('');
                        let B = b.Date.split('-').join('');
                        return A > B ? 1 : A < B ? -1 : 0;
                    });
                this.getMapPoints(this.potLuckies);
            })

        }
};
</script>
<style scoped>
.google-map {
    width: 500px;
    height: 500px;
}
</style>