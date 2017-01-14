import EventEmitter from 'events';
import Vue from 'vue/dist/vue.common';

// Templates
import App from 'OpenGroup/theme/templates/app.html!text';
import Group from 'OpenGroup/theme/templates/group.html!text';
import ConnectionButton from 'OpenGroup/theme/templates/connection-button.html!text';


/**
 * An OpenGroup is an object that holds peers and functions as a bus.
 */
class Theme extends EventEmitter {

    config = {};
    wrapper = false;

    /**
     * @param group.
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

        // var infoHookDataKeys = Object.keys(this.group.infoHookData);
        // infoHookDataKeys.forEach((infoHookDataKey) => {
        //     data[infoHookDataKey] = this.group.infoHookData[infoHookDataKey];
        // });
        //
        // Vue.component('connection-button', {
        //     template: ConnectionButton,
        // });
        //
        var appTemplateGlue = new Vue({
            el: '#app',
            data: data,
            template: App
        });


        console.log(appTemplateGlue)

    }
}

export default Theme;
