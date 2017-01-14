import EventEmitter from 'events';
import Vue from 'vue/dist/vue.common';

// Templates
import App from 'OpenGroup/theme/templates/app.html!text';
import Group from 'OpenGroup/theme/templates/group.html!text';
import GroupList from 'OpenGroup/theme/templates/group-list.html!text';
import GroupListItem from 'OpenGroup/theme/templates/group-list-item.html!text';
import ConnectionButton from 'OpenGroup/theme/templates/connection-button.html!text';


/**
 * An OpenGroup is an object that holds peers and functions as a bus.
 */
class Theme extends EventEmitter {

    config = {};
    wrapper = false;

    /**
     * @param wrapper.
     * @param config.
     * @constructor
     */
    constructor (wrapper, config = {}) {
        super();
        Object.assign(this.config, config);
        this.wrapper = wrapper;
        this.renderAll();
    }

    renderAll () {
        var data = {
            groups: this.wrapper.groups
        };

        Vue.component('connection-button', {
            template: ConnectionButton,
        });

        Vue.component('group-list', {
            template: GroupList,
            props: ['groups']
        });

        Vue.component('group-list-item', {
            template: GroupListItem,
            props: ['group']
        });

        Vue.component('group', {
            template: Group,
        });

        var appTemplateGlue = new Vue({
            el: '#app',
            data: data,
            template: App
        });

        console.log(appTemplateGlue)

    }
}

export default Theme;