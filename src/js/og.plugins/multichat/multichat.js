import EventEmitter from 'events';

/**
 * An OpenGroup multichat plugin.
 */
class MultiChat extends EventEmitter {

    /**
     * @param group.
     * @param config.
     * @constructor
     */
    constructor (group, config = {}) {
        super();
        this.config = {};
        Object.assign(this.config, config);

        group.on('og.core.multichat.message', (message, connection) => {
            console.log(message.text)
        })
    }


}

export default MultiChat;
