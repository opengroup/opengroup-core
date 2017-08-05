import EventEmitter from 'events';

import Vue from 'vue/dist/vue.common';

class ThemeManager extends EventEmitter {

    componentNames = [
        'about',
        'group-list',
        'group-list-item',
        'group-header',
        'group-settings',
        'plugin-settings-form',
        'nested-menu',
        'sidebar',
        'profile-teaser',
        'profile'
    ];

    components = {};

    constructor (wrapper) {
        super();

        this.wrapper = wrapper;
        this.wrapper.element.innerHTML = `
        <div class="region-sidebar"><router-view name="sidebar"></router-view></div>
        <div class="region-main">
            <div class="region-main-header"><router-view name="header"></router-view></div>
            <div class="region-main-content"><router-view name="main"></router-view></div>
        </div>`;

        System.import(this.wrapper.options.theme + '/css/styles.css!');
    }

    /**
     * Lazy load Vue Components.
     */
    registerComponents () {
        this.componentNames.forEach((componentName) => {
            this.components[componentName] = Vue.component(componentName, () => System.import(this.wrapper.options.theme + '/components/' + componentName + '.js')
            .then((component) => {
                let componentExecuted = component.default(this.wrapper);
                if (!componentExecuted.template) {
                    return this.getTemplate(componentName).then((template) => {
                        componentExecuted.template = template;
                        return componentExecuted;
                    });
                }
                else {
                    return componentExecuted;
                }
            }));
        });
    }

    getTemplate (templateName) {
        return System.import(this.wrapper.options.theme + '/templates/' + templateName + '.html!text');
    }
}

export default ThemeManager;