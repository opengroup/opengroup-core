import OpenGroup from 'js/og.core/OpenGroup.js';

var peer1ReturnAnswerCallback;

var groupInfo = {
    plugins: ['webrtc', 'multichat', 'multiconnect']
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

myGroup1.addPeer(peerInfo1);

myGroup1.once('ready', function () {
    myGroup1.sendMessage({
        owner: 'og.core.multichat',
        text: 'Hello World'
    });
});
