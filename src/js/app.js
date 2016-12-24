import OpenGroup from 'js/og.core/OpenGroup.js';

var myGroup = new OpenGroup();

var peerInfo = {
    type: 'og-webrtc'
};

myGroup.addPeer(peerInfo);