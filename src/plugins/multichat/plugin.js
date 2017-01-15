import Plugin from 'OpenGroup/core/Plugin';

/**
 * An OpenGroup multichat plugin.
 */
class MultiChat extends Plugin {

    name = 'multichat';
    config = {};

    /**
     * @param group.
     * @param config.
     * @constructor
     */
    constructor (group, config = {}) {
        super();
        Object.assign(this.config, config);

        group.on('og.core.multichat.message', (message, connection) => {
            console.log(message.text)
        })
    }


}

export default MultiChat;
