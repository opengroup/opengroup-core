import Plugin from 'OpenGroup/Plugin';

/**
 * An OpenGroup multichat plugin.
 */
class MultiChat extends Plugin {

    name = 'multichat';

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
