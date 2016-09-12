import AllToAllBus from 'src/js/og.core/AllToAllBus';
import WebRTCConnection from 'src/js/og.core/WebRTCConnection';

var bus = new AllToAllBus();
var connection;

var otherPeer = new WebRTCConnection();

describe('AllToAllBus', () => {
  it('should add a connection', () => {
    connection = bus.createConnection('WebRTC');
    expect(connection).to.not.equal(undefined);
  });

  it('should connect to a peer', (done) => {
    connection.getOffer((offer) => {
      otherPeer.getAnswer(offer, (answer) => {
        connection.acceptAnswer(answer);

        done();
      })
    });
  });

  it('should return a connection by id', () => {
    var connectionFetchedById = bus.getConnectionById(connection.id);
    expect(connectionFetchedById).to.equal(connection);
  });

});
