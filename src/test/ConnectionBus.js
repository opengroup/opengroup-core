import ConnectionBus from 'src/js/og.core/connection/ConnectionBus';
import EasyWebRtc from 'src/js/og.core/connection/EasyWebRct/EasyWebRtc';

let connectionBus = new ConnectionBus();
var answerer = new EasyWebRtc();
var initiator = new EasyWebRtc();

describe('ConnectionBus', () => {
  it('should initiate a webrtc connection', (done) => {
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

  it('should answer a webrtc connection', (done) => {
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
    answerer.sendMessage('Yo');

    connectionBus.on('message', (message, connection) => {
      if (message == 'Yo' && connection) {
        done();
      }
    })
  });
});


