import Bus from './og.core/bus/Bus';
import AllToAll from './og.core/bus/strategies/AllToAll';
import WebRTCConnection from './og.core/connection/WebRTCConnection';

var strategy = new AllToAll();
var bus = new Bus(strategy);

var answerConnection = new WebRTCConnection();

answerConnection.oneMessage(function (message) {
  console.log(message)
});

bus.addPeer({
  id: 'piet@pietersen',
  init: function (peer, connection) {
    console.log(peer)
    connection.getOffer((offer) => {
      answerConnection.getAnswer(offer, (answer) => {
        connection.acceptAnswer(answer, () => {
          setTimeout(function () {
            bus.sendMessage('piet@pietersen', {
              'text': 'Hello from the other side.'
            });
          }, 500);
        });
      });
    });
  }
});