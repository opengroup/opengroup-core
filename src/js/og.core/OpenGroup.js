import EventEmitter from 'events';
import OgWebRtc from './OgWebRtc.js';
import uuid from 'uuid/v4';

/**
 * An OpenGroup is an object that holds peers and functions as a bus.
 */
class OpenGroup extends EventEmitter {

    connectionTypes = {'og-webrtc': OgWebRtc};
    connections = [];

    /**
     * @param config.
     * @constructor
     */
    constructor (config = {}) {
        super();
        this.config = {};
        Object.assign(this.config, config);
    }

    addPeer (peerInfo) {
        if (!this.connectionTypes[peerInfo.connectionType]) {
            throw 'Unknown connection type provided to addPeer()';
        }
        var connectionType = this.connectionTypes[peerInfo.connectionType];
        var connection = new connectionType(peerInfo);
        connection.uuid = uuid();
        this.connections.push(connection);

        connection.on('message', (message) => {
            if (message.owner) {
                this.emit(message.owner + '.message', message, connection);
            }
            else {
                this.emit('message', message, connection);
            }
        });

        return connection;
    }

    sendMessage (message) {
        this.connections.forEach((connection) => {
            connection.sendMessage(message);
        })
    }
}

export default OpenGroup;
