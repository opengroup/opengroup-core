import Events from '../../og.core/base/Events.js';

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

    this.config = connectionBus.getService('config');
    var identity = this.config.get('PeerService.identity');

    if (identity) {
      this.setIdentity(identity);
    }

    this.connectionBus.on('newConnection', (connection) => {
      connection.sendMessage({
        identifier: 'PeerService',
        identity: this.identity
      });
    });

    this.connectionBus.on('message', (message, connection) => {
      if (message.identifier === 'PeerService' && message.identity) {
        if (connection.peer) {
          connection.peer.identity = message.identity;
          this.fire('updatedPeer', connection.peer);
        }
        else {
          connection.peer = {
            identity: message.identity,
            connection: connection
          };

          this.peers.push(connection.peer);
          this.fire('newPeer', connection.peer);
        }
      }
    });
  }

  setIdentity (identity) {
    this.identity = identity;

    if (!this.identity.guid) {
      this.identity.guid = this.guid();
    }

    this.config.set('PeerService.identity', identity);

    this.connectionBus.broadcast({
      identifier: 'PeerService',
      identity: this.identity
    });
  }

  guid () {
    var s4 = function () {
      return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    };

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  getIdentity () {
    return this.identity;
  }

  getAll () {
    var ownPeer = [{
      self: true,
      identity: this.getIdentity()
    }];

    return ownPeer.concat(this.peers);
  }

  getAllAsStream (callback) {
    this.on('newPeer updatedPeer', function () {
      callback(this.getAll());
    });

    callback(this.getAll());
  }
}

export default PeerService;
