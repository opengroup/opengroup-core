import ConnectionBus from '../js/og.core/connection/ConnectionBus.js';
import EasyWebRtc from '../js/og.core/connection/EasyWebRct/EasyWebRtc.js';

let connectionBus = new ConnectionBus();
var answerer = new EasyWebRtc();
var initiator = new EasyWebRtc();

describe('ConnectionBus', () => {
  it('should initiate a connection', (done) => {
    connectionBus.once('newConnection', (connection) => {
      done();
    });

    connectionBus.add({
      type: 'OgEasyWebRtc',
      config: {
        // OgEasyWebRtc defines this structure for its signalers.
        signaler: {
          type: 'OgEasyWebRtcSignalerTest',
          config: {
            role: 'initiator',
            events: [
              ['createdOffer', (data) => {
                answerer.getAnswer(data.offer, (answer) => {
                  data.callback(answer);
                });
              }]
            ]
          }
        }
      }
    });
  });

  it('should answer a connection', (done) => {
    connectionBus.once('newConnection', (connection) => {
      done();
    });

    initiator.getOffer((offer) => {
      connectionBus.add({
        type: 'OgEasyWebRtc',
        config: {
          // OgEasyWebRtc defines this structure for its signalers.
          signaler: {
            type: 'OgEasyWebRtcSignalerTest',
            config: {
              role: 'answerer',
              offer: offer,
              events: [
                ['createdAnswer', (data) => {
                  initiator.acceptAnswer(data.answer);
                }]
              ]
            }
          }
        }
      });
    });

  });

  it('should receive a message', (done) => {
    connectionBus.on('message', (message, connection) => {
      if (message == 'should answer a webrtc connection' && connection) {
        done();
      }
    });

    answerer.sendMessage('should answer a webrtc connection');
  });
});


