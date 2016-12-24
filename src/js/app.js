import OpenGroup from 'js/og.core/OpenGroup.js';

var myGroup1 = new OpenGroup();
var peerInfo1 = {
    connectionType: 'og-webrtc',
    signalerType: 'manual',
    signalerInfo: {
        role: 'initiator',
        offerCreated: function (offer, returnAnswerCallback) {
            console.log(offer)
        },
    }
};

var myGroup2 = new OpenGroup();
var peerInfo2 = {
    connectionType: 'og-webrtc',
    signalerType: 'manual',
    signalerInfo: {
        role: 'answerer',
        offerReceived: function (answer) {

        },
    }
};

myGroup1.addPeer(peerInfo1);