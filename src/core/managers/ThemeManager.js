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
        'profile',
        'groups',
        'group',
    ];

    components = {};

    constructor (wrapper) {
        super();

        this.wrapper = wrapper;
        this.wrapper.element.innerHTML = `<router-view></router-view>`;

        System.import(this.wrapper.options.theme + '/css/styles.css!');
    }

    /**
     * Lazy load Vue Components.
     */
    registerComponents () {
        this.componentNames.forEach((componentName) => {
            this.registerComponent(componentName);
        });
    }

    registerComponent (componentName, path) {
        if (!path) {
            path = this.wrapper.options.theme + '/components/' + componentName + '.js';
        }

        this.components[componentName] = Vue.component(componentName, () => System.import(path)
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
    }

    getTemplate (templateName) {
        return System.import(this.wrapper.options.theme + '/templates/' + templateName + '.html!text');
    }
}

export default ThemeManager;