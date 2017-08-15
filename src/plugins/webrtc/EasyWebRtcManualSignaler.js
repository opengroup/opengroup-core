import EventEmitter from 'events';
import EasyWebRtc from './EasyWebRtc.js';

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

        this.connection = new EasyWebRtc();
        if (typeof this[this.config.role] === 'function') {
            this[this.config.role]();
        }
    }

    initiator () {
        this.connection.getOffer((offer) => {
            if (typeof this.config.offerCreated === 'function') {
                this.config.offerCreated(offer, (answer) => {
                    this.connection.acceptAnswer(answer);
                });
            }
        });
    }

    answerer () {
        this.connection.getAnswer(this.config.offer, (answer) => {
            if (typeof this.config.answerCreated === 'function') {
                this.config.answerCreated(answer);
            }
        });
    }

}

export default EasyWebRtcManualSignaler;
