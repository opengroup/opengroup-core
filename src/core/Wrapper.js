import EventEmitter from 'events';
import OpenGroup from 'OpenGroup/core/OpenGroup';
import Vue from 'vue/dist/vue.common';
import VueRouter from 'vue-router';
import bluebird from 'bluebird';
import _ from 'underscore';
import 'OpenGroup/theme/css/styles.css!';

/**
 */
class Wrapper extends EventEmitter {

    groupDefinitions = [];
    groups = [];
    groupsReadyCounter = 0;
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

        this.parseGroupFromUrl();
        this.parseGroupsFromSessionStorage();

        this.groupDefinitions.forEach((groupDefinition) => {
            let newGroup = new OpenGroup(groupDefinition);
            this.groups.push(newGroup);
            newGroup.on('ready', () => {
                this.groupsReadyCounter++;

                // TODO one failing group breaks the application.
                if (this.groupsReadyCounter === this.groupDefinitions.length) {
                    this.renderAll();
                }
            });
        });
    }

    addGroupDefinition (newGroupDefinition) {
        let knownGroupNames = this.groupDefinitions.map((groupDefinition) => groupDefinition.uuid);
        if (!knownGroupNames.includes(newGroupDefinition.uuid)) {
            this.groupDefinitions.push(newGroupDefinition);
        }
    }

    parseGroupFromUrl () {
        let group = this.getUrlParameter('group');

        if (group) {
            try {
                let groupDefinition = JSON.parse(group);
                this.addGroupDefinition(groupDefinition);
            }
            catch (Exception) {
                console.log(Exception)
            }
        }
    }

    getUrlParameter (name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        let results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    parseGroupsFromSessionStorage () {
        let existingGroups = JSON.parse(window.sessionStorage.getItem('og-groups'));

        if (existingGroups) {
            _.forEach(existingGroups, (groupDefinition) => {
                this.addGroupDefinition(groupDefinition);
            });
        }
    }

    nestMenu (items) {
        let hashTable = Object.create(null);

        items = _(items).chain()
        .sortBy((item) => item.path.split('/').length)
        .sortBy('weight')
        .value();

        items.forEach(item => hashTable[item.path] = { ...item, childNodes : [] } );

        let dataTree = [];

        items.forEach( item => {
            let itemPathSplit = item.path.split('/');
            let parentPath = itemPathSplit;
            parentPath.pop();
            parentPath = parentPath.join('/');
            if ( itemPathSplit.length > 1 ) hashTable[parentPath].childNodes.push(hashTable[item.path]);
            else dataTree.push(hashTable[item.path]);
        });

        return {
            nested: dataTree,
            hashed: hashTable
        };
    }

    renderAll () {
        let routerData = {};
        Vue.use(VueRouter);
        let wrapper = this;

        let getSubMenu = function (context) {
            let submenu = [];

            context.items.forEach((item) => {
                if (item.path === context.$router.currentRoute.path.substr(0, item.path.length)) {
                    submenu = item.childNodes;
                }
            });

            return submenu;
        };

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
                        submenu: getSubMenu(this)
                    };
                },
                watch: {
                    '$route': function() {
                        this.submenu = getSubMenu(this);
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
                        groups: wrapper.groups
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

            this.groups.forEach((group) => {
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

            let menu = wrapper.nestMenu(routerData.routes);
            this.groups.forEach((group) => {
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


