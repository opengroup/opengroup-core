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
  constructor (group) {
    super();

    if (group) { this.group = group; }
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

  addService (name, serviceClass, config) {
    this.services[name] = new serviceClass(this, config);
    this.services[name].connectionBus = this;
    if (typeof this.services[name].init === 'function') {
      this.services[name].init();
    }
  }

  getService (name) {
    if (this.services[name]) {
      return this.services[name];
    }
  }
}

export default ConnectionBus;