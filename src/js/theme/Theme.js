import EventEmitter from 'events';
import Vue from 'vue/dist/vue.common';
import AppTemplate from 'OpenGroup/theme/templates/app.html!text';

/**
 * An OpenGroup is an object that holds peers and functions as a bus.
 */
class Theme extends EventEmitter {

    config = {};

    /**
     * @param group.
     * @param config.
     * @constructor
     */
    constructor (group, config = {}) {
        super();
        Object.assign(this.config, config);
        this.group = group;
    }

    renderAll () {
        var data = {};

        var infoHookDataKeys = Object.keys(this.group.infoHookData);
        infoHookDataKeys.forEach((infoHookDataKey) => {
            data[infoHookDataKey] = this.group.infoHookData[infoHookDataKey];
        });

        Vue.component('connection-button', {
            template: '<div>A custom component!</div>',
        });

        var appTemplateGlue = new Vue({
            el: '#app',
            data: data,
            template: AppTemplate
        });


        console.log(appTemplateGlue)

    }
}

export default Theme;
