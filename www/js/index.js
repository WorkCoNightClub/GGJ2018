/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        //create the context for the web audio
var audioCtx = new window.AudioContext();
//create, tune, start and connect each oscillator sinea, sineb and sinec
var sinea = audioCtx.createOscillator();
var gainNode = audioCtx.createGain();



sinea.frequency.value = 440;
sinea.type = "sine";
sinea.start();
sinea.connect(gainNode);
var sineb = audioCtx.createOscillator();
sineb.frequency.value = 523.25;
sineb.type = "sine";
sineb.start();
sineb.connect(gainNode);
var sinec = audioCtx.createOscillator();
sinec.frequency.value = 698.46;
sinec.type = "sine";
sinec.start();

sinec.connect(gainNode);

gainNode.connect(audioCtx.destination);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
