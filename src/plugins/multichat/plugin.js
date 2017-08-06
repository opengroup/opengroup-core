import Plugin from 'OpenGroup/core/Plugin';

/**
 * An OpenGroup multichat plugin.
 */
class MultiChat extends Plugin {

    name = 'multichat';
    config = {};

    componentNames = [
        'multichat'
    ];

    /**
     * @param group.
     * @param config.
     * @constructor
     */
    constructor (group, config = {}) {
        super();
        this.group = group;
        Object.assign(this.config, config);
    }

    getMenuItems () {
        return [{
            title: 'Chat',
            component: 'multichat',
            subPath: 'chat',
        }];
    }
}

export default MultiChat;
