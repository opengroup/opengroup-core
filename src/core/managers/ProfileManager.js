import EventEmitter from 'events';
import _ from 'underscore';
import Vue from 'vue/dist/vue.common';

class ProfileManager extends EventEmitter {

    constructor (wrapper) {
        super();
        this.wrapper = wrapper;

        this.wrapper.routeManager.on('routesAlter', (routes) => {
            routes.push({
                path: '/profile',
                name: 'profile',
                components: {
                    main: Vue.options.components['profile']
                }
            });
        })
    }

}

export default ProfileManager;