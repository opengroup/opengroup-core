import Events from 'src/js/og.core/base/Events';

/**
 * PeerService.
 */
class PeerService extends Events {
  /**
   * @constructor
   */
  constructor (connectionBus) {
    super();

    this.peers = [];
    this.connectionBus = connectionBus;
  }

  init () {
    this.answerIdentityRequest();
    this.requestIdentity();
  }

  setIdentity (identity) {
    this.identity = identity;
  }

  requestIdentity () {
    this.connectionBus.on('newConnection', (connection) => {
      connection.on('message', (message) => {
        this.savePeerIdentity(message, connection);
      });

      connection.sendMessage({
        identifier: 'PeerService',
        command: 'identify'
      });
    });
  }

  savePeerIdentity (message, connection) {
    if (message.identifier === 'PeerService' && message.identity) {
      var peer = {
        identity: message.identity,
        connection: connection
      };

      connection.peer = connection;

      this.peers.push(peer);
      connection.off('message', this.savePeerIdentity);
      this.fire('newPeer', peer);
    }
  }

  answerIdentityRequest () {
    this.connectionBus.on('message', (message, connection) => {
      if (message.identifier && message.identifier === 'PeerService' && message.command && message.command == 'identify') {
        connection.sendMessage({
          identifier: 'PeerService',
          identity: this.identity
        });
      }
    });
  }

  getAll () {
    return this.peers;
  }

  getAllAsStream (callback) {
    this.on('newPeer', function () {
      callback(this.getAll());
    });

    callback(this.getAll());
  }
}

export default PeerService;