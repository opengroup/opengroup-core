import EventEmitter from 'events';
import uuid from 'uuid/v4';
import bluebird from 'bluebird';

/**
 * An OpenGroup is an object that holds peers and functions as a bus.
 */
class OpenGroup extends EventEmitter {

    connectionTypes = {};
    connections = [];
    plugins = {};
    pluginsAreLoaded = false;

    /**
     * @param config.
     * @constructor
     */
    constructor (config = {}) {
        super();
        this.config = {
            plugins: {}
        };

        Object.assign(this.config, config);

        if (!this.config.uuid) {
            throw new Error('The group has no uuid');
        }

        this.uuid = this.config.uuid;
        this.slug = this.config.name ? this.config.name.toLowerCase().replace(/ /g, '-') : this.uuid;
        this.ensureLid();

        let pluginsToLoad = [];

        let pluginUris = Object.keys(this.config.plugins);

        pluginUris.forEach((pluginUri) => {
            pluginsToLoad.push(this.addPlugin(pluginUri, this.config.plugins[pluginUri]));
        });

        bluebird.all(pluginsToLoad).then(() => {
            this.pluginsAreLoaded = true;
            this.emit('ready');
        });
    }

    ensureLid () {
        if (!this.lid) {
            this.lid = sessionStorage.getItem('og-lid-' + this.uuid);

            if (!this.lid) {
                this.lid = window.prompt('Please enter your identity');
                sessionStorage.setItem('og-lid-' + this.uuid, this.lid);
            }
        }
    }

    addPeer (peerInfo) {
        if (!peerInfo.uuid) { throw 'Undefined uuid'; }
        if (this.pluginsAreLoaded) {
            if (!this.connectionTypes[peerInfo.connectionType]) {
                throw 'Unknown connection type provided to addPeer()';
            }
            let connectionType = this.connectionTypes[peerInfo.connectionType];
            let connection = new connectionType(peerInfo);

            connection.uuid = peerInfo.uuid;
            this.connections.push(connection);

            connection.once('connected', () => {
                this.emit('newConnection', connection);
            });

            connection.once('closed', () => {
                this.emit('closedConnection', connection);

                let index = this.connections.indexOf(connection);
                if (index !== -1) {
                    this.connections.splice(index, 1);
                }
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

    addPlugin (pluginUri, config) {
        return new Promise((resolve) => {
            if (pluginUri.substr(0, 4) !== 'http') {
                pluginUri = '/plugins/' + pluginUri;
            }

            System.import(pluginUri + '/plugin.js').then((plugin) => {
                let newPlugin = new plugin.default(this, config);
                this.plugins[newPlugin.getName()] = newPlugin;
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
