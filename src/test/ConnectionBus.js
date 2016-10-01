import ConnectionBus from 'src/js/og.core/connection/ConnectionBus';
import EasyWebRtc from 'src/js/og.core/connection/EasyWebRct/EasyWebRtc';

let connectionBus = new ConnectionBus();

describe('ConnectionBus', () => {
  it('should initiate a webrtc connection', (done) => {
    var answerer = new EasyWebRtc();

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
    var initiator = new EasyWebRtc();

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
});

