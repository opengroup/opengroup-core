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

        // TODO use props.
        this.group.on('og.core.multichat.message', (object, connection) => {
            this.messages.push(object.message);
        })
    }

    getMenuItems () {
        return [{
            title: 'Chat',
            component: 'multichat',
            path: '/groups/' + this.group.slug + '/multichat'
        }];
    }
}

export default MultiChat;
