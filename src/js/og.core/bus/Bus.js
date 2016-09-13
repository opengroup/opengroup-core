import Peer from './../peer/Peer';

class Bus {
  constructor (busStrategy) {
    this.peers = [];
    this.strategy = busStrategy;
  }

  addPeer (configuration = {}) {
    if (!configuration.id) { throw new TypeError('Please add an ID in the configuration of addPeer'); }
    if (this.getPeerById(configuration.id)) { throw new TypeError('Peer already exists in addPeer'); }

    var newPeer = new Peer(configuration.id, this);
    this.strategy.createConnectionForPeer(newPeer);
    var connection = this.strategy.getConnectionByPeerId(configuration.id);

    if (typeof configuration.init === 'function') {
      configuration.init(connection);
    }

    this.peers.push(newPeer);
  }

  getPeerById (peerId = false) {
    if (peerId) {
      return this.peers.filter((peer) => peer.getId() === peerId)[0];
    }
  }

  sendMessage (peerId, message) {
    this.strategy.sendMessage(peerId, message);
  }
}

export default Bus;
