import Plugin from 'OpenGroup/core/Plugin';
import VueChatScroll from 'vue-chat-scroll'
import Vue from 'vue/dist/vue.common';

/**
 * An OpenGroup multichat plugin.
 */
class MultiChat extends Plugin {

    label = 'MultiChat';
    description = 'Lorem ipsum';
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
        Vue.use(VueChatScroll);
    }

    getMenuItems () {
        return [{
            title: 'Chat',
            component: 'multichat',
            subPath: 'chat',
            weight: -9999
        }];
    }
}

export default MultiChat;
