import EventEmitter from 'events';

import Vue from 'vue/dist/vue.common';

class ThemeManager extends EventEmitter {

    componentNames = [
        'about',
        'group-list',
        'group-list-item',
        'group-header',
        'plugin-settings-form',
        'nested-menu',
        'sidebar',
        'profile-teaser',
        'profile',
        'group',
        'groups',
        'add-group',
        'group-settings'
    ];

    components = {};

    constructor (wrapper) {
        super();

        this.wrapper = wrapper;
        this.wrapper.element.innerHTML = `<router-view></router-view>`;

        System.import('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css!');
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

    registerComponent (componentName, basePath = this.wrapper.options.theme) {
        this.components[componentName] = Vue.component(componentName, () => System.import(basePath + '/components/' + componentName + '.js')
        .then((component) => {
            let componentExecuted = component.default(this.wrapper);
            if (!componentExecuted.template) {
                return this.getTemplate(componentName, basePath).then((template) => {
                    componentExecuted.template = template;
                    return componentExecuted;
                });
            }
            else {
                return componentExecuted;
            }
        }));
    }

    getTemplate (templateName, basePath = this.wrapper.options.theme) {
        return System.import(basePath + '/templates/' + templateName + '.html!text');
    }
}

export default ThemeManager;