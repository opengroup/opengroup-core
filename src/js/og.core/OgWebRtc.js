import EventEmitter from 'events';
import EasyWebRtc from './EasyWebRtc.js';

/**
 * An OpenGroup is an object that holds peers and functions as a bus.
 */
class OgWebRtc extends EventEmitter {

    /**
     * @param config.
     * @constructor
     */
    constructor (config = {}) {
        super();
        this.config = {};
        Object.assign(this.config, config);
    }

    init () {
        this.connection = new EasyWebRtc();
    }
}

export default OgWebRtc;
