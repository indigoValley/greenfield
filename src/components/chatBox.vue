<template>
<div type="text/x-template" id="modal-template">
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              default header
            </slot>
          </div>
          <div class="modal-body">
            <slot name="body">
              <div id="chat-box">
          <div id="chat-window">
            <div id="output"></div>
          </div>
            <div id="feedback"></div>
          <p id="handle">{{name}}</p>
          <input id="message" type="text" placeholder="Message">
          <b-btn id="send" class="btn btn-success">Send</b-btn>
          </div>
            </slot>
            </div>
            <div class="modal-footer">
            <slot name="footer">
              <b-btn id="close" class="modal-default-button" @click="$emit('close')">
                Close chat
              </b-btn>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</div>


    
</template>


<script>
// Imports
import lodash from 'lodash'

export default {
  props: [
    'event', 'name'
  ],
    created() {
      console.log(_.isEmpty() ? 'Lodash is available' : 'Error');
    },

    data() {
        return {

        }
    },
    mounted() {
      console.log(this.name);
        const socket = io.connect();


        const message = document.getElementById('message');
        const handle = document.getElementById('handle');
        const btn = document.getElementById('send');
        const output = document.getElementById('output');
        const feedback = document.getElementById('feedback');

        const eventName = this.event.Name;
        console.log(eventName);
        socket.emit('open', {
          event: eventName,
        })

        btn.addEventListener('click', () => {
            socket.emit('chat', {
                message: message.value,
                handle: this.name,
                event: eventName,
            });
            message.value = '';
        });

        message.addEventListener('keypress', () => {
            socket.emit('typing', this.name);
        });

        socket.on('chat', (data) => {
            feedback.innerHTML = '';
            output.innerHTML += `<p><strong>${data.handle}:</strong>${data.message}</p>`;
        });


        socket.on('typing', (data) => {
            socket.emit(feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>');
        });

         message.addEventListener('keyup', (message) => {
          socket.emit('doneTyping', message.handle)
          });

          const debounced = _.debounce(() => {
            feedback.innerHTML = "";
          }, 3000);   

          socket.on('doneTyping', () => {
            debounced();
          });
          
        }
    }




</script>

<style scoped>
h2 {
    font-size: 18px;
    padding: 10px 20px;
    color: #575ed8;
}

#chat-box {
    max-width: 600px;
    margin: 30px auto;
    border: 1px solid #ddd;
    box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.05);
    border-radius: 2px;
}

#chat-window {
    height: 300px;
    overflow: auto;
    position: relative;
    background: #f9f9f9;
}

#output p {
    overflow: auto;
    position: absolute;
    bottom: 0;
    padding: 14px 0px;
    margin: 0 20px;
    border-bottom: 1px solid #e9e9e9;
    color: #555;
    max-height: 400px;
}

#feedback p {
    overflow: auto;
    position: absolute;
    bottom: 0;
    color: #aaa;
    padding: 14px 0px;
    margin: 0 20px;
    height: 20px;
    max-height: 400px;
}

#output strong {
    color: #575ed8;
}

label {
    box-sizing: border-box;
    display: block;
    padding: 10px 20px;
}

input {
    padding: 10px 20px;
    box-sizing: border-box;
    background: #eee;
    border: 0;
    display: block;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #eee;
    font-family: Nunito;
    font-size: 16px;
}


.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 500px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 10px 20px rgba(247, 111, 48, 0.781);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 2;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
  background-color: rgba(247, 111, 48, 0.781);
}



/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>