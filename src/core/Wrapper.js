import EventEmitter from 'events';

import Vue from 'vue/dist/vue.common';
import VueRouter from 'vue-router';
import VueFormGenerator from 'vue-form-generator';

import GroupManager from 'OpenGroup/core/managers/GroupManager';
import MenuManager from 'OpenGroup/core/managers/MenuManager';
import ThemeManager from 'OpenGroup/core/managers/ThemeManager';
import RouteManager from 'OpenGroup/core/managers/RouteManager';

/**
 */
class Wrapper extends EventEmitter {

    options = {
        selector: '#app',
        theme: 'OpenGroup/theme',
    };

    /**
     * @constructor
     */
    constructor (options) {
        super();
        this.options = Object.assign(this.options, options);
        this.element = document.querySelector(this.options.selector);

        this.menuManager = new MenuManager(this);
        this.themeManager = new ThemeManager(this);
        this.groupManager = new GroupManager(this);
        this.routeManager = new RouteManager(this);

        this.groupManager.on('ready', () => {
            this.startVue();
        })
    }

    startVue () {
        Vue.use(VueFormGenerator);
        Vue.use(VueRouter);

        this.themeManager.registerComponents();

        this.router = new VueRouter({
            routes: this.routeManager.getRoutes()
        });

        this.vueRoot = new Vue({
            router: this.router
        }).$mount(this.options.selector);
    }
}

export default Wrapper;


