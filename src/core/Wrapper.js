import EventEmitter from 'events';
import OpenGroup from 'OpenGroup/core/OpenGroup';
import Vue from 'vue/dist/vue.common';
import VueRouter from 'vue-router';
import bluebird from 'bluebird';
import _ from 'underscore';

/**
 */
class Wrapper extends EventEmitter {

    groupDefinitions = [];
    groups = [];
    groupsReadyCounter = 0;

    /**
     * @constructor
     */
    constructor () {
        super();

        this.parseGroupFromUrl();
        this.parseGroupsFromSessionStorage();

        this.groupDefinitions.forEach((groupDefinition) => {
            var newGroup = new OpenGroup(groupDefinition);
            this.groups.push(newGroup);
            newGroup.on('ready', () => {
                this.groupsReadyCounter++;

                // TODO one failing group breaks the application.
                if (this.groupsReadyCounter == this.groupDefinitions.length) {
                    this.renderAll();
                }
            });
        });
    }

    addGroupDefinition (newGroupDefinition) {
        var knownGroupNames = this.groupDefinitions.map((groupDefinition) => groupDefinition.uuid);
        if (!knownGroupNames.includes(newGroupDefinition.uuid)) {
            this.groupDefinitions.push(newGroupDefinition);
        }
    }

    parseGroupFromUrl () {
        var group = this.getUrlParameter('group');

        if (group) {
            try {
                var groupDefinition = JSON.parse(group);
                this.addGroupDefinition(groupDefinition);
            }
            catch (Exception) {
                console.log(Exception)
            }
        }
    }

    getUrlParameter (name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    parseGroupsFromSessionStorage () {
        var existingGroups = JSON.parse(window.sessionStorage.getItem('og-groups'));

        if (existingGroups) {
            _.forEach(existingGroups, (groupDefinition) => {
                this.addGroupDefinition(groupDefinition);
            });
        }
    }

    nestMenu (items) {
        let hashTable = Object.create(null);

        items.forEach(item => hashTable[item.path] = { ...item, childNodes : [] } );

        let dataTree = [];

        items.forEach( item => {
            var itemPathSplit = item.path.split('/');
            var parentPath = itemPathSplit;
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
        var routerData = {};
        Vue.use(VueRouter);
        var wrapper = this;

        var getSubMenu = function (context) {
            var submenu = [];

            context.items.forEach((item) => {
                if (item.path == context.$router.currentRoute.path.substr(0, item.path.length)) {
                    submenu = item.childNodes;
                }
            });

            return submenu;
        };

        var microTemplatesInfo = {
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

        var templatePromises = [];

        Object.keys(microTemplatesInfo).forEach(function (microTemplateKey) {
            var microTemplateInfo = microTemplatesInfo[microTemplateKey];

            templatePromises.push(System.import('OpenGroup/theme/templates/' + microTemplateKey + '.html!text').then(function (template) {
                microTemplateInfo.template = template;
                Vue.component(microTemplateKey, microTemplateInfo);
            }));
        });

        // Load all the micro templates async, when all are loaded:
        bluebird.all(templatePromises).then(() => {
            var groupListComponent = {
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
                var groupHeaderComponent = {
                    data: function () {
                        return {
                            group: group
                        };
                    },
                    computed: microTemplatesInfo['group-header'].computed,
                    template: microTemplatesInfo['group-header'].template
                };

                group.triggerInfoHook('groupSubRoutes', group);

                var firstSubRoute = {
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

            var menu = wrapper.nestMenu(routerData.routes);
            this.groups.forEach((group) => {
                group.menu = menu.hashed['/groups/' + group.slug].childNodes;
                group.menuHash = menu.hashed;
            });

            this.router = new VueRouter(routerData);

            var appTemplateGlue = new Vue({
                router: this.router
            }).$mount('#app');

            window.vuething = appTemplateGlue

            if (appTemplateGlue.$route.matched.length == 0) {
                this.router.push('/groups')
            }
        });

    }
}

export default Wrapper;


