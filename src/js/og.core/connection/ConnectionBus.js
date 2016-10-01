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

    this.connections = [];
  }

  add (connectionInfo) {
    var connection = new connectionTypes[connectionInfo.type](connectionInfo.config);

    connection.on('connected', () => {
      this.connections.push(connection);
      this.fire('newConnection', connection);
    });
  }
}

export default ConnectionBus;