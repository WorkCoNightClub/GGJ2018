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
var devices = {}
var devicesArray = [];
// Timer that updates the displayed list of devices.
var updateTimer = null


var app = {
    // Application Constructor
    initialize: function() {
        console.log("mortacci der loggghe")
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');

        this.startScan();
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');

        receivedElement.setAttribute('style', 'display:block;');
        this.startScan();


    },

    startScan: function()
{

    // Make sure scan is stopped.
    this.stopScan()

    // Start scan.
    evothings.ble.startScan(
        function(device)
        {
            // Device found. Sometimes an RSSI of +127 is reported.
            // We filter out these values here.
            if (device.rssi <= 0 && device.name =='EST')
            {
                // Set timeStamp.
                device.timeStamp = Date.now()
                setJamID(device);
                // Store device in table of found devices.

                devices[device.address] = device

                devicesArray.push(device);
            }
        },
        function(error)
        {
            showMessage('Scan error: ' + error)
            stopScan()
        }
    )

    // Start update timer.
    updateTimer = setInterval(updateDeviceList, 500)
},

stopScan: function()
{
    // Stop scan.
    evothings.ble.stopScan()

    // Clear devices.
    devices = {}

    // Stop update timer.
    if (updateTimer)
    {
        clearInterval(updateTimer)
        updateTimer = null
    }

},

 showMessage: function(message)
{
    console.log(message)
},

    updateDeviceList: function()
{
    var timeNow = Date.now();

    devicesArray.forEach(function (device)
    {
        // Only show devices that have been updated during the last 10 seconds.

        if (device.timeStamp + 10000 > timeNow && device.name =='EST')
        {
            var deviceID = '#' + getDeviceDomId(device);
            setJamID(device);
            showMessage(device.JamID);
            updateDevice(device);
        }
        else
        {
            // Remove inactive device.
            removeDevice(device);
        }
    })
},


    updateDevice: function(device)
{
    // Map the RSSI value to a width in percent for the indicator.
    var distanceBarValue = 100; // Used when RSSI is zero or greater.
    if (device.rssi < -100) { distanceBarValue = 1; }
    else if (device.rssi < 0) { distanceBarValue = 100 + device.rssi; }
},


    removeDevice: function (device)
{

    // Delete from model.
    delete devices[devices.address]
    var index = devicesArray.indexOf(device);
    if (index > -1) {
        devicesArray.splice(index, 1);
    }
},

    getDeviceDomId:function (device)
{
    return 'device-dom-id-' + device.address.replace(/:/g, "_")
},

    getJamID: function(device)
{

    var idBeacon = JSON.stringify(device.advertisementData.kCBAdvDataServiceData);
    if(idBeacon.includes("5fkY0crCtuX5GNE="))
        return 1;
    if(idBeacon.includes("PEVVCJP8tjxFVQg="))
        return 2;
    if(idBeacon.includes("c5WK4wXitnOViuM="))
        return 3;
    return -1;
},

    setJamID: function (device)
{
    var idBeacon = JSON.stringify(device.advertisementData.kCBAdvDataServiceData);
    if(idBeacon.includes("5fkY0crCtuX5GNE="))
    {
        device.JamID = 1;
        return;
    }
    if(idBeacon.includes("PEVVCJP8tjxFVQg="))
    {
        device.JamID = 2;
        return;
    }
    if(idBeacon.includes("c5WK4wXitnOViuM="))
    {
        device.JamID = 3;
        return;
    }
    return;
}


};

app.initialize();


