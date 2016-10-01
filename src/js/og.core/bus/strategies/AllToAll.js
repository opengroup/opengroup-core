import WebRTCConnection from './../../connection/WebRTCConnection';

class AllToAll {
  constructor () {
    this.connections = {};

    // Bus will be set by the bus.
    this.bus = false;
  }

  sendMessage (peerId, message) {
    var connection = this.getConnectionByPeerId(peerId);
    if (typeof connection === 'undefined') {
      throw new Error('Peer: ' + peerId + ' was not found to send a message to.');
    } else {
      connection.sendMessage(message);
    }
  }

  broadcast (message) {
    for (var key in this.connections) {
      if (!this.connections.hasOwnProperty(key)) continue;
      var connection = this.connections[key];
      connection.sendMessage(message);
    }
  }

  createConnectionForPeer (peer) {
    this.connections[peer.getId()] = new WebRTCConnection();
    this.connections[peer.getId()].onMessage = (message) => {
      this.bus.receiveMessage(message, peer);
    };
  }

  getConnectionByPeerId (peerId) {
    if (this.connections[peerId]) {
      return this.connections[peerId];
    }
  }
}

export default AllToAll;
