import EventEmitter from 'events';
import bluebird from 'bluebird';
import uuid from 'uuid/v4';

/**
 * An OpenGroup is an object that holds peers and functions as a bus.
 */
class OpenGroup extends EventEmitter {

    connectionTypes = {};
    connections = [];
    plugins = {};
    pluginsAreLoaded = false;
    state = 'starting';
    menuItems = [];

    /**
     * @param wrapper.
     * @param config.
     * @constructor
     */
    constructor (wrapper, config = {}) {
        super();
        this.wrapper = wrapper;
        this.config = {
            plugins: {}
        };

        Object.assign(this.config, config);

        if (!this.config.uuid) {
            throw new Error('The group has no uuid');
        }

        this.lid = uuid();
        this.uuid = this.config.uuid;
        this.slug = this.config.name ? this.config.name.toLowerCase().replace(/ /g, '-') : this.uuid;

        // TODO move these properties back to the config and make getters.
        this.config.uuid = this.uuid;
        this.config.slug = this.slug;

        let pluginsToLoad = [];

        let pluginUris = Object.keys(this.config.plugins);

        pluginUris.forEach((pluginUri) => {
            pluginsToLoad.push(this.addPlugin(pluginUri, this.config.plugins[pluginUri]));
        });

        bluebird.all(pluginsToLoad).then(() => {
            this.pluginsAreLoaded = true;
            this.state = 'ready';
            this.emit('ready');
        });
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

                this.emit('message', message, connection);
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

                if (newPlugin.componentNames) {
                    newPlugin.componentNames.forEach((componentName) => {
                        this.wrapper.themeManager.registerComponent(componentName, pluginUri);
                    });
                }

                if (newPlugin.getMenuItems) {
                    newPlugin.getMenuItems().forEach((menuItem) => {
                        if (!menuItem.path && menuItem.subPath) {
                            menuItem.path = '/groups/' + this.slug + '/' + menuItem.subPath;
                        }
                        this.menuItems.push(menuItem);
                    });
                }


                if (typeof newPlugin.settingsForm === 'function') {
                    this.menuItems.push({
                        title: newPlugin.settingsForm()['title'],
                        path: '/groups/' + this.slug + '/settings/' + newPlugin.name
                    });
                }

                this.emit('pluginAdded', newPlugin.getName(), newPlugin);
                resolve();
            });
        });
    }

    sendMessage (message) {
        this.connections.forEach((connection) => {
            connection.sendMessage(message);
            this.emit('messageSentToConnection', message, connection);
        });

        this.emit('messageSent', message)
    }

    getMenuItems () {
        return this.menuItems;
    }

    save () {
        this.emit('save', this.config);
    }
}

export default OpenGroup;
