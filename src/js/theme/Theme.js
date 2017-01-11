import EventEmitter from 'events';
import Vue from 'vue/dist/vue.common';
import HtmlTemplate from 'OpenGroup/theme/templates/html.html!text';

/**
 * An OpenGroup is an object that holds peers and functions as a bus.
 */
class Theme extends EventEmitter {

    /**
     * @param group.
     * @param config.
     * @constructor
     */
    constructor (group, config = {}) {
        super();
        this.config = {};
        Object.assign(this.config, config);
        this.group = group;
    }

    renderAll () {
        var data = {};

        var infoHookDataKeys = Object.keys(this.group.infoHookData);
        infoHookDataKeys.forEach((infoHookDataKey) => {
            data[infoHookDataKey] = this.group.infoHookData[infoHookDataKey];
        });

        var appTemplateGlue = new Vue({
            el: '#app',
            data: data,
            template: HtmlTemplate
        });

        console.log(appTemplateGlue)
    }
}

export default Theme;
