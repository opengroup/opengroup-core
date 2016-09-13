import WebRTCConnection from './../../connection/WebRTCConnection';

class AllToAll {
  constructor () {
    this.connections = {};
  }

  sendMessageToPeer (message, peer) {

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
