import EventEmitter from 'events';
import EasyWebRtcManualSignaler from './EasyWebRtcManualSignaler.js';

/**
 * An OpenGroup is an object that holds peers and functions as a bus.
 */
class OgWebRtc extends EventEmitter {

    signalerTypes = {'manual': EasyWebRtcManualSignaler };

    /**
     * @param config.
     * @constructor
     */
    constructor (config = {}) {
        super();
        this.config = {};
        Object.assign(this.config, config);

        if (this.signalerTypes[config.signalerType]) {
            var signalerType = this.signalerTypes[config.signalerType];
            this.signaler = new signalerType(config.signalerInfo);
            this.connection = this.signaler.connection;

            var proxyEvents = ['message', 'closed', 'connected', 'error'];

            proxyEvents.forEach((proxyEvent) => {
                this.connection.on(proxyEvent, () => {
                    if (typeof this[proxyEvent] == 'function') {
                        this[proxyEvent](...arguments);
                    }
                });
            });
        }
    }
}

export default OgWebRtc;
