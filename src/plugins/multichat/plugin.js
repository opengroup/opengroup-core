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

        /*
        let plugin = this;

        return [{
            title: 'Chat',
            subPath: '/multichat',
            weight: -10,
            template: MultiChatTemplate,
            data: function () {
                return {
                    newMessage: '',
                    messages: plugin.messages
                }
            },
            methods: {
                sendChat: function (event) {
                    if ((event.metaKey || event.ctrlKey) && event.keyCode === 13) {

                        plugin.messages.push({
                            text: this.newMessage,
                            self: true
                        });

                        plugin.group.sendMessage({
                            owner: 'og.core.multichat',
                            message: {
                                text: this.newMessage
                            }
                        });

                        this.newMessage = '';
                    }
                }
            },
        }];
    } */
}

export default MultiChat;
