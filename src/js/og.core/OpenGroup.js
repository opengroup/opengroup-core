import EventEmitter from 'events';
import OgWebRtc from './OgWebRtc.js';
import uuid from 'uuid/v4';

/**
 * An OpenGroup is an object that holds peers and functions as a bus.
 */
class OpenGroup extends EventEmitter {

    connectionTypes = {'og-webrtc': OgWebRtc};
    connections = [];
    plugins = [];

    /**
     * @param config.
     * @constructor
     */
    constructor (config = {}) {
        super();
        this.config = {
            plugins: []
        };
        Object.assign(this.config, config);

        this.config.plugins.forEach((pluginUri) => {
           if (pluginUri.substr(0, 4) == 'http') {

           }
           else {
               fetch('/js/og.plugins/' + pluginUri + '/plugin.json').then((response) => {
                   return response.json();
               })
               .then((pluginInfo) => {
                    if (pluginInfo.files && pluginInfo.files.length) {
                        pluginInfo.files.forEach((filePath) => {
                            var fileExtention = filePath.split('.').pop();

                            if (fileExtention == 'js') {
                                System.import('../js/og.plugins/' + pluginUri + '/' + filePath).then((plugin) => {
                                    var newPlugin = new plugin.default(this);
                                    this.plugins.push(newPlugin);
                                });
                            }
                        });
                    }
               });
           }
        });
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

    addPlugin (pluginInfo) {

    }

    sendMessage (message) {
        this.connections.forEach((connection) => {
            connection.sendMessage(message);
        });
    }
}

export default OpenGroup;
