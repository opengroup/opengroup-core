import EventEmitter from 'events';
import uuid from 'uuid/v4';
import bluebird from 'bluebird';

/**
 * An OpenGroup is an object that holds peers and functions as a bus.
 */
class OpenGroup extends EventEmitter {

    connectionTypes = {};
    connections = [];
    plugins = [];
    pluginsAreLoaded = false;

    /**
     * @param config.
     * @constructor
     */
    constructor (config = {}) {
        super();
        this.config = { plugins: [] };
        Object.assign(this.config, config);

        var pluginsToLoad = [];

        this.config.plugins.forEach((pluginUri) => {
            pluginsToLoad.push(this.addPlugin(pluginUri));
        });

        bluebird.all(pluginsToLoad).then(() => {
            this.pluginsAreLoaded = true;
            this.emit('ready');
        });
    }

    addPeer (peerInfo) {
        if (this.pluginsAreLoaded) {
            if (!this.connectionTypes[peerInfo.connectionType]) {
                throw 'Unknown connection type provided to addPeer()';
            }
            var connectionType = this.connectionTypes[peerInfo.connectionType];
            var connection = new connectionType(peerInfo);
            connection.uuid = uuid();
            this.connections.push(connection);

            connection.once('connected', () => {
                this.emit('newConnection', connection);
            });

            connection.on('message', (message) => {
                if (message.owner) {
                    this.emit(message.owner + '.message', message, connection);
                }
                else {
                    this.emit('message', message, connection);
                }
            });
        }
        else {
            this.once('ready', () => {
                this.addPeer(peerInfo);
            })
        }
    }

    addPlugin (pluginUri) {
        return new Promise((resolve, reject) => {
            let pluginJsPath;

            if (pluginUri.substr(0, 4) == 'http') {
                pluginJsPath = pluginUri + '/plugin.js';
            }
            else {
                pluginJsPath = '/js/og.plugins/' + pluginUri + '/plugin.js';
            }

            System.import(pluginJsPath).then((plugin) => {
                var newPlugin = new plugin.default(this);
                this.plugins.push(newPlugin);
                this.emit('pluginAdded', newPlugin.getName(), newPlugin);
                resolve();
            });
        });
    }

    sendMessage (message) {
        this.connections.forEach((connection) => {
            connection.sendMessage(message);
            this.emit('messageSendToConnection', message, connection);
        });

        this.emit('messageSend', message)
    }
}

export default OpenGroup;
