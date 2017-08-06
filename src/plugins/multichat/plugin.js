import Plugin from 'OpenGroup/core/Plugin';
import MultiChatTemplate from './templates/multichat.html!text';

/**
 * An OpenGroup multichat plugin.
 */
class MultiChat extends Plugin {

    name = 'multichat';
    config = {};
    messages = [];

    menuItems = [
        {
            title: 'Chat',
            component: 'multichat'
        }
    ];

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

        this.group.on('og.core.multichat.message', (object, connection) => {
            this.messages.push(object.message);
        })
    }
}

export default MultiChat;
