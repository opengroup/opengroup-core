import OpenGroup from 'OpenGroup/core/OpenGroup';

var peer1ReturnAnswerCallback;
var peer3ReturnAnswerCallback;

var groupInfo = {
    element: '#group-1',
    plugins: [
        'http://og-plugins.daniel/webrtc',
        'http://og-plugins.daniel/multichat',
        'multiconnect',
        'og-signaler'
    ]
};

var myGroup = new OpenGroup(groupInfo);
myGroup.once('ready', function () {
    myGroup.plugins['og-signaler'].addUrl('ws://localhost:4080/lorem-ipsum');
});
//
//
// var myGroup2 = new OpenGroup(groupInfo);
// var peerInfo2 = {
//     uuid: myGroup2.uuid,
//     connectionType: 'og-webrtc',
//     signalerType: 'manual',
//     signalerInfo: {
//         role: 'answerer',
//         answerCreated: function (answer) {
//             peer1ReturnAnswerCallback(answer);
//         }
//     }
// };
//
// var myGroup1 = new OpenGroup(groupInfo);
// var peerInfo1 = {
//     connectionType: 'og-webrtc',
//     uuid: myGroup1.uuid,
//     signalerType: 'manual',
//     signalerInfo: {
//         role: 'initiator',
//         offerCreated: function (offer, returnAnswerCallback) {
//             peer1ReturnAnswerCallback = returnAnswerCallback;
//             peerInfo2.signalerInfo.offer = offer;
//             myGroup2.addPeer(peerInfo2);
//         },
//     }
// };
//
// myGroup1.addPeer(peerInfo1);
//
// myGroup1.once('ready', function () {
//     myGroup1.sendMessage({
//         owner: 'og.core.multichat',
//         text: 'Hello World'
//     });
// });
//
// var myGroup3 = new OpenGroup(groupInfo);
//
//
// var peerInfo4 = {
//     uuid: myGroup3.uuid,
//     connectionType: 'og-webrtc',
//     signalerType: 'manual',
//     signalerInfo: {
//         role: 'answerer',
//         answerCreated: function (answer) {
//             peer3ReturnAnswerCallback(answer);
//         }
//     }
// };
//
// var peerInfo3 = {
//     uuid: uuid(),
//     connectionType: 'og-webrtc',
//     signalerType: 'manual',
//     signalerInfo: {
//         role: 'initiator',
//         offerCreated: function (offer, returnAnswerCallback) {
//             peer3ReturnAnswerCallback = returnAnswerCallback;
//             peerInfo4.signalerInfo.offer = offer;
//             myGroup2.addPeer(peerInfo4);
//         },
//     }
// };
//
// myGroup3.addPeer(peerInfo3);
