import WebRTCConnection from './WebRTCConnection';

const connectionClassesMapping = {
  'WebRTC': WebRTCConnection
};

class AllToAllBus {
  constructor () {
    this.connections = [];
  }

  createConnection (connectionType, connectionInfo = {}) {
    var connection = new connectionClassesMapping[connectionType](connectionInfo);
    this.connections.push(connection);
    return connection;
  }

  getConnectionById (id = false) {
    if (id) {
      return this.connections.filter((connection) => connection.id == id)[0];
    }
  }
}

export default AllToAllBus;