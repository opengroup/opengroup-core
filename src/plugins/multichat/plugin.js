import Plugin from 'OpenGroup/core/Plugin';
import MultiChatTemplate from './templates/multichat.html!text';

/**
 * An OpenGroup multichat plugin.
 */
class MultiChat extends Plugin {

    name = 'multichat';
    config = {};
    messages = [];

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

    groupSubRoutes () {
        let plugin = this;

        return [
            {
                path: '/groups/' + this.group.slug + '/multichat',
                title: 'Chat',
                weight: -99,
                components: {
                    main: {
                        data: function () {
                            return {
                                newMessage: '',
                                messages: plugin.messages
                            }
                        },
                        methods: {
                            sendChat: function (event) {
                                if ((event.metaKey || event.ctrlKey) && event.keyCode === 13) {

                                    this.group.sendMessage({
                                        owner: 'og.core.multichat',
                                        message: {
                                            text: this.newMessage
                                        }
                                    });

                                    this.newMessage = '';
                                }
                            }
                        },
                        template: MultiChatTemplate
                    }
                },
            }
        ];
    }


}

export default MultiChat;
