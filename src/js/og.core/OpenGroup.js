import EventEmitter from 'events';
import OgWebRtc from './OgWebRtc.js';

/**
 * An OpenGroup is an object that holds peers and functions as a bus.
 */
class OpenGroup extends EventEmitter {

    connectionTypes = {'og-webrtc': OgWebRtc};

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
        if (!this.connectionTypes[peerInfo.type]) {
            throw 'Unknown connection type provided to addPeer()';
        }
        var connectionType = this.connectionTypes[peerInfo.type];
        this.connection = new connectionType();
        this.connection.init(peerInfo);
    }
}

export default OpenGroup;
