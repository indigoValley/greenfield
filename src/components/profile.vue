<template>
    <b-container>
       
						
        <b-row>
            <div class="col-lg-12">
                <div class="card hovercard">
                    <div class="card-background">
                        <img class="card-bkimg" alt="" src="https://scontent-dft4-3.xx.fbcdn.net/v/t1.0-9/10447708_10105496802291065_3147331436798292945_n.jpg?oh=ff797fce9d955f7447e90ee529022d1c&oe=5A420D4C">
                    </div>
                    <div class="useravatar">
                    <span class="card-title"><b>{{this.data.profileName}}</b></span>
                    <br>
                        <img alt="" v-bind:src="data.image">
                    </div>
                    <br>
                    <div class="card-info">
                    Email:<span class="card-title">{{this.data.profileEmail}}</span>
                    Current City: <span class="card-title">{{this.data.profileCity}}</span>
                    Date of birth: <span class="card-title">{{this.data.birthday}}</span>
                    Host Rating: <span class="card-title">{{this.data.profileHR}}</span>
                    Guest Rating: <span class="card-title">{{this.data.profileCR}}</span>
                    </div>
                </div>
            </div>
        </b-row>
        <br>
        <div class="row" v-if="!showEvent">
            <div class="col-sm-4" id="eventList">
                <h4 v-if="!showEvent">Upcoming Events:</h4>
                <b-btn v-if="showEvent" v-on:click='showEvent = !showEvent'> Hide Details</b-btn>
                <div>
                    <div v-for="event in this.data.events" v-bind:key="event.id">
                        <hr>
                        <div class="row">
                            <div class="col-sm-8">
                                {{event.Name}}<br>
                                <small>{{event.Date}}</small>
                            </div>
                            <div class="col-sm-1">
                                <button class="btn btn-sm btn-info" align="right" v-on:click='sEvent(event)'>Event Details</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-sm-3" id="friendsList">
                <h4>Friends:</h4>
                <div>
                    <div v-for="(friend, index) in this.data.friends" v-bind:key="index">
                        <hr>
                        <div class="row">
                            <div class="col-sm-6">
                                {{friend}}
                            </div>
                            <div class="col-sm-1">
                                <button id="removeFriend" class="btn btn-sm btn-danger" @click="removeFriend(friend)">unfriend</button>
                            </div>
                        </div>
                        <br>
                    </div>
                </div>
            </div>

            <div class="col-sm-5" id="notifications">
                <h4>Notifications:</h4>
                <div>
                    <div v-for="(notification, index) in this.data.notifications" v-bind:notification="notification" v-bind:key="index">
                        <hr>
                        <li>
                            {{notification}}
                            <br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <button class="btn btn-sm btn-success" id="approve" @click="approveRequest(notification, index)">Approve this request</button>
                            <button class="btn btn-sm btn-danger" id="approve" @click="denyRequest(notification, index)">Deny this request</button> 
                        </li>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" v-if="showEvent">
            &nbsp;&nbsp;&nbsp;&nbsp;
            <button class="btn btn-sm btn-warning" v-on:click='showEvent = !showEvent' align="center"> Hide Event Details</button>
            <eventdiv 
                v-if="showEvent" 
                v-bind:event="event" 
                v-bind:name="this.data.profileName" 
                v-bind:addFriend="this.addFriend" 
                v-bind:isFriend="this.isFriend"
            ></eventdiv>
        </div>
    </b-container>
</template>

<script>
// Imports
import eventdiv from './event.vue'
export default {
    components: {
        eventdiv: eventdiv,
    },
    data() {
        return {
            event: '',
            showEvent: false,
            data: {
                profileName: '',
                profileCity: '',
                profileEmail: '',
                profileHR: '',
                profileCR: '',
                birthday: '',
                notifications: '',
                notificationData: [],
                events: [],
                image: '',
                friends: [],
            }


        }
    },
    mounted: function() {
        this.$http.get('/profile')
            .then(function(response) {
                console.log(response.body);
                this.data.profileName = response.body.Name;
                this.data.profileCity = response.body.City;
                this.data.profileEmail = response.body.Email;
                this.data.profileHR = response.body.hostRating;
                this.data.profileCR = response.body.contributorRating;
                this.data.birthday = response.body.Birthday;
                this.data.image = response.body.Image || "http://media.istockphoto.com/photos/businessman-silhouette-as-avatar-or-default-profile-picture-picture-id476085198?k=6&m=476085198&s=612x612&w=0&h=5cDQxXHFzgyz8qYeBQu2gCZq1_TN0z40e_8ayzne0X0=";
            }, (err) => {
                this.$router.push('/login');
            });
        this.$http.get('/userevents')
            .then(function(response) {
                this.data.events = response.body;
            }, (err) => {
                this.$router.push('/login');
            })
        this.$http.get('/notifications')
            .then(function(response) {
                if (!response.body.length) {
                    return;
                }
                console.log(response.body);
                let notificationDataPairs = [];
                const notifications = response.body;
                let formattedNotifications = [];
                notifications.forEach((notification) => {
                    if (notification !== '') {
                        let split = notification.split(':');
                        notificationDataPairs.push(split);
                        formattedNotifications.push(`${split[1]} wants to join your ${split[0]} party!`);
                    }
                })

                this.data.notificationData = notificationDataPairs;
                console.log(formattedNotifications);
                this.data.notifications = formattedNotifications.length ? formattedNotifications : [];
            })
        this.getFriends();
    },
    methods: {
        sEvent(clickedEvent) {
            this.event = clickedEvent
            this.showEvent = !this.showEvent;
        },
        approveRequest(notification, index) {
            console.log('approve:', this.data.notificationData[index]);
            const data = this.data.notificationData[index];
            this.$http.post('/approve', {
                eventName: data[0],
                approvedUser: data[1],
            }).then((response) => {
                this.data.notifications.splice(index, 1);
                this.data.notificationData.splice(index, 1);
            }).catch((err) => {
                console.log('error approving request');
            })
        },
        getFriends() {
            this.$http.get('/friends')
            .then((response) => {
                this.data.friends = response.body;
            })
            .catch((err) => {
                console.log('error getting friends', err);
            });
        },
        removeFriend(name) {
            this.$http.delete('/friends', {
                body: {
                    name
                }
            })
            .then((response) => {
                console.log(response);
                this.getFriends();
            })
            .catch((err) => {
                console.log('error removing friend', err);
            })
        },
        addFriend(friendName) {
            console.log('add friend', friendName);
            this.$http.post('/friends', {
                name: friendName,
            })
            .then((response) => {
                console.log(response);
                this.getFriends();
            });
        },
        isFriend(name) {
            if (name === this.data.profileName) return true;
            return this.data.friends.indexOf(name) !== -1;
        },

    }
}
</script>

<style scoped>
.card {
    margin-top: 20px;
    padding: 30px;
    background-color: rgba(214, 224, 226, 0.2);
    -webkit-border-top-left-radius: 5px;
    -moz-border-top-left-radius: 5px;
    border-top-left-radius: 5px;
    -webkit-border-top-right-radius: 5px;
    -moz-border-top-right-radius: 5px;
    border-top-right-radius: 5px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

.card.hovercard {
    position: relative;
    padding-top: 0;
    overflow: hidden;
    text-align: center;
    background-color: #fff;
    background-color: rgba(255, 255, 255, 1);
}

.card.hovercard .card-background {
    height: 130px;
}

.card-background img {
    -webkit-filter: blur(25px);
    -moz-filter: blur(25px);
    -o-filter: blur(25px);
    -ms-filter: blur(25px);
    filter: blur(25px);
    margin-left: -100px;
    margin-top: -200px;
    min-width: 130%;
}

.card.hovercard .useravatar {
    position: absolute;
    top: 15px;
    left: 0;
    right: 0;
}

.card.hovercard .useravatar img {
    width: 100px;
    height: 100px;
    max-width: 100px;
    max-height: 100px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    border: 5px solid rgba(255, 255, 255, 0.5);
}

.card.hovercard .card-info {
    position: absolute;
    bottom: 14px;
    left: 0;
    right: 0;
}

.card.hovercard .card-info .card-title {
    padding: 0 5px;
    font-size: 20px;
    line-height: 1;
    color: #262626;
    background-color: rgba(255, 255, 255, 0.1);
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
}

.card.hovercard .card-info {
    overflow: hidden;
    font-size: 12px;
    line-height: 20px;
    color: #737373;
    text-overflow: ellipsis;
}

.card.hovercard .bottom {
    padding: 0 20px;
    margin-bottom: 17px;
}

.btn-pref .btn {
    -webkit-border-radius: 0 !important;
}

</style>