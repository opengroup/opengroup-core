import EventEmitter from 'events';

import Vue from 'vue/dist/vue.common';
import VueRouter from 'vue-router';
import bluebird from 'bluebird';
import _ from 'underscore';
import 'OpenGroup/theme/css/styles.css!';
import GroupManager from 'OpenGroup/core/GroupManager';
import MenuManager from 'OpenGroup/core/MenuManager';

/**
 */
class Wrapper extends EventEmitter {

    options = {
        selector: '#app'
    };

    /**
     * @constructor
     */
    constructor (options) {
        super();

        this.options = Object.assign(this.options, options);
        this.element = document.querySelector(this.options.selector);
        this.element.innerHTML = `
        <div class="region-sidebar"><router-view name="sidebar"></router-view></div>
        <div class="region-main">
            <div class="region-main-header"><router-view name="header"></router-view></div>
            <div class="region-main-content"><router-view name="main"></router-view></div>
        </div>`;

        this.menuManager = new MenuManager();
        this.groupManager = new GroupManager();
        this.groupManager.on('ready', () => {
            this.renderAll();
        })
    }

    renderAll () {
        let routerData = {};
        Vue.use(VueRouter);
        let wrapper = this;

        let microTemplatesInfo = {
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

        Object.keys(microTemplatesInfo).forEach(function (microTemplateKey) {
            let microTemplateInfo = microTemplatesInfo[microTemplateKey];

            templatePromises.push(System.import('OpenGroup/theme/templates/' + microTemplateKey + '.html!text').then(function (template) {
                microTemplateInfo.template = template;
                Vue.component(microTemplateKey, microTemplateInfo);
            }));
        });

        // Load all the micro templates async, when all are loaded:
        bluebird.all(templatePromises).then(() => {
            let groupListComponent = {
                data: function () {
                    return {
                        groups: wrapper.groupManager.groups
                    };
                },
                template: microTemplatesInfo['group-list'].template
            };

            routerData = {
                routes: [
                    {
                        path: '/groups',
                        alias: '/',
                        name: 'groups',
                        components: {
                            sidebar: groupListComponent
                        },
                    },
                    {
                        path: '/about',
                        components: {
                            main: {
                                template: microTemplatesInfo['about'].template
                            }
                        }
                    },
                ]
            };

            wrapper.groupManager.groups.forEach((group) => {
                let groupHeaderComponent = {
                    data: function () {
                        return {
                            group: group
                        };
                    },
                    computed: microTemplatesInfo['group-header'].computed,
                    template: microTemplatesInfo['group-header'].template
                };

                group.triggerInfoHook('groupSubRoutes', group);

                let firstSubRoute = {
                    path: '/groups/' + group.slug,
                    components: {
                        sidebar: groupListComponent,
                        header: groupHeaderComponent,
                    }
                };

                // Redirect to the first plugin.
                if (group.infoHookData['groupSubRoutes'].length) {
                    firstSubRoute.redirect = group.infoHookData['groupSubRoutes'][0].path;
                }

                routerData.routes.push(firstSubRoute);

                // Merge in plugin routes.
                group.infoHookData['groupSubRoutes'].forEach(function (groupSubRoute) {
                    // If the plugin does not actively fill the sidebar and the header views.
                    if (!groupSubRoute.components.sidebar) {
                        groupSubRoute.components.sidebar = groupListComponent;
                    }

                    if (!groupSubRoute.components.header) {
                        groupSubRoute.components.header = groupHeaderComponent;
                    }

                    routerData.routes.push(groupSubRoute);
                });
            });

            let menu = wrapper.menuManager.nestMenu(routerData.routes);
            this.groupManager.groups.forEach((group) => {
                group.menu = menu.hashed['/groups/' + group.slug].childNodes;
                group.menuHash = menu.hashed;
            });

            this.router = new VueRouter(routerData);

            let appTemplateGlue = new Vue({
                router: this.router
            }).$mount('#app');

            window.vuething = appTemplateGlue;

            if (appTemplateGlue.$route.matched.length === 0) {
                this.router.push('/groups')
            }
        });

    }
}

export default Wrapper;


