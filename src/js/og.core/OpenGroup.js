import EventEmitter from 'events';
import uuid from 'uuid/v4';
import async from 'async';

/**
 * An OpenGroup is an object that holds peers and functions as a bus.
 */
class OpenGroup extends EventEmitter {

    connectionTypes = {};
    connections = [];
    plugins = [];

    /**
     * @param config.
     * @constructor
     */
    constructor (config = {}) {
        super();
        this.config = { plugins: [] };
        Object.assign(this.config, config);

        var pluginInits = [];

        this.config.plugins.forEach((pluginUri) => {
            pluginInits.push(() => {
                return this.addPlugin(pluginUri);
            });
        });

        async.parallel(pluginInits, function(err, results) {
            console.log(err, results)
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

    addPlugin (pluginUri) {
        return new Promise(
            (resolve, reject) => {
                let pluginJsonPath;

                if (pluginUri.substr(0, 4) == 'http') {
                    pluginJsonPath = pluginUri + '/plugin.json';
                }
                else {
                    pluginJsonPath = '/js/og.plugins/' + pluginUri + '/plugin.json';
                }

                fetch(pluginJsonPath).then((response) => {
                    return response.json();
                }).then((pluginInfo) => {
                    pluginInfo = Object.assign({ files: [] }, pluginInfo);

                    if (pluginInfo.main) {
                        System.import('../js/og.plugins/' + pluginUri + '/' + pluginInfo.main).then((plugin) => {
                            var newPlugin = new plugin.default(this);
                            this.plugins.push(newPlugin);
                            resolve();
                        });
                    }
                    else {
                        resolve();
                    }
                });
            }
        );
    }

    sendMessage (message) {
        this.connections.forEach((connection) => {
            connection.sendMessage(message);
        });
    }
}

export default OpenGroup;
