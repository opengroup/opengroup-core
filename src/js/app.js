import Bus from './og.core/bus/Bus';
import AllToAll from './og.core/bus/strategies/AllToAll';

var strategy1 = new AllToAll();
var bus1 = new Bus(strategy1);

var strategy2 = new AllToAll();
var bus2 = new Bus(strategy2);

bus1.addPeer({
  id: 'piet@pietersen',
  init: function (peer1, connection1) {
    connection1.getOffer((offer) => {
      bus2.addPeer({
        id: 'henk@pietersen',
        init: function (peer2, connection2) {
          connection2.getAnswer(offer, (answer) => {
            connection1.acceptAnswer(answer, () => {
              bus1.sendMessage('piet@pietersen', {
                'text': 'Hello from the world.'
              });

              bus2.sendMessage('henk@pietersen', {
                'text': 'Hello from the other side.'
              });
            });
          });
        }
      });
    });
  }
});
