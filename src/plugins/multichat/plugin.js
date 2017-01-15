import Plugin from 'OpenGroup/core/Plugin';
import MultiChatTemplate from './templates/multichat.html!text';

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

    groupSubRoutes () {
        return [
            {
                path: 'multichat',
                title: 'Chat',
                component: {
                    data: function () {
                        return {}
                    },
                    template: MultiChatTemplate
                },
            }
        ];
    }


}

export default MultiChat;
