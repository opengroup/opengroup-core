import EventEmitter from 'events';

/**
 * An OpenGroup is an object that holds peers and functions as a bus.
 */
class EasyWebRtcManualSignaler extends EventEmitter {

    /**
     * @param config.
     * @constructor
     */
    constructor (config = {}) {
        super();
        this.config = {};
        Object.assign(this.config, config);
    }

}

export default EasyWebRtcManualSignaler;
