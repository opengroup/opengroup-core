import EventEmitter from 'events';
import _ from 'underscore';
import Vue from 'vue/dist/vue.common';

class ThemeManager extends EventEmitter {

    microTemplatesInfo = {};

    constructor (wrapper) {
        super();
        this.wrapper = wrapper;
        this.wrapper.element.innerHTML = `
        <div class="region-sidebar"><router-view name="sidebar"></router-view></div>
        <div class="region-main">
            <div class="region-main-header"><router-view name="header"></router-view></div>
            <div class="region-main-content"><router-view name="main"></router-view></div>
        </div>`;
    }

    loadDefaultTemplates () {
        let wrapper = this.wrapper;

        this.microTemplatesInfo = {
            'about': {},
            'connection-button': {},
            'group-list': { props: ['groups'] },
            'group-list-item': { props: ['group'] },
            'group-header': {
                props: ['group']
            },
            'nested-menu': {
                props: ['items'],
                data: function () {
                    return {
                        submenu: wrapper.menuManager.getSubMenu(this)
                    };
                },
                watch: {
                    '$route': function() {
                        this.submenu = wrapper.menuManager.getSubMenu(this);
                    },
                }
            }
        };

        let templatePromises = [];

        Object.keys(this.microTemplatesInfo).forEach(function (microTemplateKey) {
            let microTemplateInfo = this.microTemplatesInfo[microTemplateKey];

            templatePromises.push(System.import('OpenGroup/theme/templates/' + microTemplateKey + '.html!text').then(function (template) {
                microTemplateInfo.template = template;
                Vue.component(microTemplateKey, microTemplateInfo);
            }));
        });
    }
}

export default ThemeManager;