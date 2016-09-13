import Bus from 'src/js/og.core/bus/Bus';
import AllToAll from 'src/js/og.core/bus/strategies/AllToAll';
import WebRTCConnection from 'src/js/og.core/connection/WebRTCConnection';

var strategy = new AllToAll();
var bus = new Bus(strategy);

var returnedPeer = false;

var answerConnection = new WebRTCConnection();

describe('Bus', () => {

  it('should have no peers after creating', () => {
    expect(bus.peers.length).to.equal(0);
  });

  it('should have the peer when adding one', () => {
    bus.addPeer({
      id: 'henk@jansen.nl'
    });

    expect(bus.peers[0].getId()).to.equal('henk@jansen.nl');
  });

  it('should throw an error when missing the id', () => {
    expect(bus.addPeer).to.throw(TypeError, 'Please add an ID in the configuration of addPeer');
  });

  it('should throw an error when using an already used id', () => {
    expect(function () {
      bus.addPeer({
        id: 'henk@jansen.nl'
      });
    }).to.throw(TypeError, 'Peer already exists in addPeer');
  });

  it('should return a peer by id', () => {
    returnedPeer = bus.getPeerById('henk@jansen.nl');
    expect(returnedPeer).to.equal(bus.peers[0]);
  });

  it('should connect the peer when adding one', (done) => {
    bus.addPeer({
      id: 'piet@pietersen',
      init: function (peer, connection) {
        connection.getOffer((offer) => {
          answerConnection.getAnswer(offer, (answer) => {
            connection.acceptAnswer(answer, () => {
              done();
            });
          });
        });
      }
    });
  });

  it('should send a peer a message and the peer should receive it via webrtc', (done) => {
    answerConnection.oneMessage(function (message) {
      if (message.text == 'Hello from the other side.') {
        done();
      }
    });

    bus.sendMessage('piet@pietersen', {
      'text': 'Hello from the other side.'
    });
  });
});

describe('AllToAll bus strategy', () => {
  it('should have created a connection for the peer', () => {
    var connection = bus.strategy.getConnectionByPeerId(returnedPeer.getId());
    expect(connection instanceof WebRTCConnection).to.equal(true);
  });
});

