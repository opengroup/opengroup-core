import WebRTCConnection from './../../connection/WebRTCConnection';

class AllToAll {
  constructor () {
    this.connections = {};
  }

  sendMessage (peerId, message) {
    var connection = this.getConnectionByPeerId(peerId);
    connection.sendMessage(message);
  }

  createConnectionForPeer (peer) {
    this.connections[peer.getId()] = new WebRTCConnection();
  }

  getConnectionByPeerId (peerId) {
    if (this.connections[peerId]) {
      return this.connections[peerId];
    }
  }
}

export default AllToAll;
