import OpenGroup from 'js/og.core/OpenGroup.js';

var peer1ReturnAnswerCallback;

var groupInfo = {
    plugins: ['multichat']
};

var myGroup2 = new OpenGroup(groupInfo);
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

var myGroup1 = new OpenGroup(groupInfo);
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

var peer1 = myGroup1.addPeer(peerInfo1);

setTimeout(function () {
    myGroup1.sendMessage({
        owner: 'og.core',
        text: 'Hello World'
    });
}, 2000);

