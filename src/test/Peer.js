import Peer from 'src/js/og.core/peer/Peer';

describe('Peer', () => {
  var peer = new Peer('henk@jansen.nl');

  it('should have an id after creating', () => {
    expect(peer.getId()).to.equal('henk@jansen.nl');
  });

});

