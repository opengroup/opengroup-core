import OpenGroup from 'js/og.core/OpenGroup.js';

var myGroup1 = new OpenGroup();


var myGroup2 = new OpenGroup();
var peerInfo2;


var peerInfo1 = {
    connectionType: 'og-webrtc',
    signalerType: 'manual',
    signalerInfo: {
        role: 'initiator',
        offerCreated: function (offer, returnAnswerCallback) {
            console.log(offer)

            peerInfo2 = {
                connectionType: 'og-webrtc',
                signalerType: 'manual',
                signalerInfo: {
                    role: 'answerer',
                    offer: offer
                }
            };

            myGroup2.addPeer(peerInfo2);
        },
    }
};

myGroup1.addPeer(peerInfo1);
