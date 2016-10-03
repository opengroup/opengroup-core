import Events from '../base/Events.js';
import OgEasyWebRtc from '../connection/EasyWebRct/OgEasyWebRtc.js';
import ConfigService from '../config/ConfigService.js';

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

    this.addService('config', ConfigService, {
      prefix: this.getGroupId()
    });
  }

  getGroupId () {
    if (this.group) {
      return this.group.id;
    } else {
      return 'og';
    }
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

    return connection;
  }

  broadcast (message) {
    this.connections.forEach((connection) => {
      connection.sendMessage(message);
    });
  }

  addService (name, ServiceClass, config) {
    this.services[name] = new ServiceClass(this, config);
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
