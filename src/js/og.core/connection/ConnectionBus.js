import Events from 'src/js/og.core/base/Events';
import OgEasyWebRtc from 'src/js/og.core/connection/EasyWebRct/OgEasyWebRtc';

var connectionTypes = {
  'OgEasyWebRtc': OgEasyWebRtc
};

/**
 * ConnectionBus holds all the connections of a (local) group.
 */
class ConnectionBus extends Events {
  /**
   * @constructor
   */
  constructor () {
    super();

    this.services = {};
    this.connections = [];
  }

  add (connectionInfo) {
    var connection = new connectionTypes[connectionInfo.type](connectionInfo.config);

    connection.on('connected', () => {
      this.connections.push(connection);
      this.fire('newConnection', connection);
    });

    connection.on('message', (message) => {
      this.fire('message', message, connection);
    });
  }

  broadcast (message) {
    this.connections.forEach((connection) => {
      connection.sendMessage(message);
    })
  }

  addService (name, service) {
    this.services[name] = service;
    service.connectionBus = this;
    if (typeof service.init === 'function') {
      service.init();
    }
  }

  getService (name) {
    if (this.services[name]) {
      return this.services[name];
    }
  }
}

export default ConnectionBus;