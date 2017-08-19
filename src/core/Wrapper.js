import EventEmitter from 'events';

import Vue from 'vue/dist/vue.common';
import VueRouter from 'vue-router';
import VueFormGenerator from 'vue-form-generator';

import GroupManager from 'OpenGroup/core/managers/GroupManager';
import MenuManager from 'OpenGroup/core/managers/MenuManager';
import ThemeManager from 'OpenGroup/core/managers/ThemeManager';
import RouteManager from 'OpenGroup/core/managers/RouteManager';
import ProfileManager from 'OpenGroup/core/managers/ProfileManager';
import StorageManager from 'OpenGroup/core/managers/StorageManager';

/**
 */
class Wrapper extends EventEmitter {

    routes = [];

    options = {
        selector: '#app',
        theme: 'theme',
    };

    state = 'starting';

    /**
     * @constructor
     */
    constructor (options) {
        super();
        this.options = Object.assign(this.options, options);
        this.element = document.querySelector(this.options.selector);

        this.themeManager = new ThemeManager(this);
        this.groupManager = new GroupManager(this);
        this.menuManager = new MenuManager(this);
        this.routeManager = new RouteManager(this);
        this.profileManager = new ProfileManager(this);
        this.storageManager = new StorageManager(this);

        this.themeManager.loadCss().then(() => {
            this.startVue();
        });
    }

    startVue () {
        Vue.use(VueFormGenerator);
        Vue.use(VueRouter);

        this.themeManager.registerComponents();
        this.routes = this.routeManager.getAppRoutes();
        this.menuManager.indexMenuItems(this.routes);

        this.router = new VueRouter({
            routes: this.routes,
        });

        this.vueRoot = new Vue({
            router: this.router,
        }).$mount(this.options.selector);

        this.state = 'preReady';
        this.emit('preReady');
        this.state = 'ready';
        this.emit('ready');
    }
}

export default Wrapper;


