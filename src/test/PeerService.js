import ConnectionBus from '../js/og.core/connection/ConnectionBus.js';
import PeerService from '../js/og.core/peer/PeerService.js';

let connectionBus1 = new ConnectionBus();
connectionBus1.addService('peer', PeerService);
var peerService1 = connectionBus1.getService('peer');
peerService1.setIdentity({
  name: 'Henk Jansen'
});

let connectionBus2 = new ConnectionBus();
connectionBus2.addService('peer', PeerService);
var peerService2 = connectionBus2.getService('peer');
peerService2.setIdentity({
  name: 'Piet Bakker'
});

describe('peerService', () => {
  it('should receive a name', (done) => {

    connectionBus1.add({
      type: 'OgEasyWebRtc',
      config: {
        // OgEasyWebRtc defines this structure for its signalers.
        signaler: {
          type: 'OgEasyWebRtcSignalerTest',
          config: {
            role: 'initiator',
            events: [
              ['createdOffer', (data1) => {

                connectionBus2.add({
                  type: 'OgEasyWebRtc',
                  config: {
                    // OgEasyWebRtc defines this structure for its signalers.
                    signaler: {
                      type: 'OgEasyWebRtcSignalerTest',
                      config: {
                        role: 'answerer',
                        offer: data1.offer,
                        events: [
                          ['createdAnswer', (data2) => {
                            data1.callback(data2.answer);
                          }]
                        ]
                      }
                    }
                  }
                });

              }]
            ]
          }
        }
      }
    });

    peerService1.on('newPeer', function (peer) {
      if (peer.identity.name === 'Piet Bakker') {
        done();
      }
    });

  });

  it('should list all peers', (done) => {
    var peers = peerService1.getAll();
    if (peers[0].identity.name == 'Piet Bakker') {
      done();
    }
  });

  it('should list all peers in a data stream', (done) => {
    peerService1.getAllAsStream(function (peers) {
      if (peers[1] && peers[1].identity.name == 'Klaas') {
        done();
      }
    });

    var dummyPeer = {
      identity: {
        name: 'Klaas'
      }
    };

    peerService1.peers.push(dummyPeer);
    peerService1.fire('newPeer', dummyPeer);
  });
});