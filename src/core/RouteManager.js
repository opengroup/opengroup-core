import EventEmitter from 'events';
import Vue from 'vue/dist/vue.common';

class RouteManager extends EventEmitter {

    constructor (wrapper) {
        super();
        this.wrapper = wrapper;
    }

    getAppRoutes () {
        return [
            {
                path: '/groups',
                alias: '/',
                name: 'groups',
                components: {
                    sidebar: Vue.options.components['group-list']
                },
            },
            {
                path: '/about',
                name: 'about',
                components: {
                    main: Vue.options.components['about']
                }
            }
        ];
    }

    createGroupRoutes () {
        let groupRoutes = [];
        let groups = this.wrapper.groupManager.getGroups();

        groups.forEach((group) => {
            groupRoutes.push({
                path: '/groups/' + group.slug,
                name: group.slug,
                meta: {
                    group: group,
                },
                components: {
                    sidebar: Vue.options.components['group-list'],
                    header: Vue.options.components['group-header'],
                }
            });
        });

        return groupRoutes;
    }

    getRoutes () {
        let appRoutes = this.getAppRoutes();
        let groupRoutes = this.createGroupRoutes();

        let allRoutes = [...appRoutes, ...groupRoutes];

        console.log(allRoutes);

        return allRoutes;
    }
}

export default RouteManager;