import EventEmitter from 'events';
import EasyWebRtcManualSignaler from './EasyWebRtcManualSignaler.js';
import './webrtc.polyfill.js';

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

            var proxyEvents = ['message', 'closed', 'connected', 'error'];

            proxyEvents.forEach((proxyEvent) => {
                this.signaler.connection.on(proxyEvent, (...args) => {
                    this.emit(proxyEvent, ...args);
                });
            });
        }
    }

    sendMessage (message) {
        this.signaler.connection.sendMessage(message);
    }
}

export default OgWebRtc;
