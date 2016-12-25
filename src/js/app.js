import OpenGroup from 'js/og.core/OpenGroup.js';

var peer1ReturnAnswerCallback;

var myGroup2 = new OpenGroup();
var peerInfo2 = {
    connectionType: 'og-webrtc',
    signalerType: 'manual',
    signalerInfo: {
        role: 'answerer',
        answerCreated: function (answer) {
            peer1ReturnAnswerCallback(answer);
        }
    }
};

var myGroup1 = new OpenGroup();
var peerInfo1 = {
    connectionType: 'og-webrtc',
    signalerType: 'manual',
    signalerInfo: {
        role: 'initiator',
        offerCreated: function (offer, returnAnswerCallback) {
            peer1ReturnAnswerCallback = returnAnswerCallback;
            peerInfo2.signalerInfo.offer = offer;
            myGroup2.addPeer(peerInfo2);
        },
    }
};

myGroup1.addPeer(peerInfo1);
