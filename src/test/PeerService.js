import ConnectionBus from 'src/js/og.core/connection/ConnectionBus';
import PeerService from 'src/js/og.core/peer/PeerService';
import EasyWebRtc from 'src/js/og.core/connection/EasyWebRct/EasyWebRtc';

let connectionBus1 = new ConnectionBus();
let peerService1 = new PeerService({
  name: 'Henk Jansen'
});
connectionBus1.addService('peer', peerService1);

let connectionBus2 = new ConnectionBus();
let peerService2 = new PeerService({
  name: 'Piet Bakker'
});
connectionBus2.addService('peer', peerService2);

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
      peers.forEach(function (peer) {
        console.log(peer.identity.name)
      });

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