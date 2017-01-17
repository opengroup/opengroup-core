import EventEmitter from 'events';
import OpenGroup from 'OpenGroup/core/OpenGroup';
import Vue from 'vue/dist/vue.common';
import VueRouter from 'vue-router';
import bluebird from 'bluebird';

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
        this.saveGroupsToSessionStorage();

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
        var knownGroupNames = this.groupDefinitions.map((groupDefinition) => groupDefinition.name);
        if (!knownGroupNames.includes(newGroupDefinition.name)) {
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
            existingGroups.forEach((groupDefinition) => {
                this.addGroupDefinition(groupDefinition);
            });
        }
    }

    saveGroupsToSessionStorage () {
        window.sessionStorage.setItem('og-groups', JSON.stringify(this.groupDefinitions));
    }


    renderAll () {
        Vue.use(VueRouter);
        var wrapper = this;

        var microTemplatesInfo = {
            'about': {},
            'connection-button': {},
            'group-list': { props: ['groups'] },
            'group-list-item': { props: ['group'] },
            'group-header': {}
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
            var allGroupSubRoutes = [];

            this.groups.forEach((group) => {
                group.triggerInfoHook('groupSubRoutes');

                var firstSubRoute = {
                    path: group.slug,
                    components: {
                        header: {
                            data: function () {
                                return {
                                    group: group
                                };
                            },
                            template: microTemplatesInfo['group-header'].template
                        }
                    },
                    children: group.infoHookData['groupSubRoutes']
                };

                // Redirect to the first plugin.
                if (group.infoHookData['groupSubRoutes'].length) {
                    // firstSubRoute.redirect = '/groups/' + group.slug + '/' + group.infoHookData['groupSubRoutes'][0].path;
                }

                allGroupSubRoutes.push(firstSubRoute);
            });

            var routerData = {
                routes: [
                    {
                        path: '/groups',
                        alias: '/',
                        name: 'groups',
                        components: {
                            sidebar: {
                                data: function () {
                                    return {
                                        groups: wrapper.groups
                                    };
                                },
                                template: microTemplatesInfo['group-list'].template
                            }
                        },
                        children: allGroupSubRoutes
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

            this.router = new VueRouter(routerData);

            var appTemplateGlue = new Vue({
                router: this.router
            }).$mount('#app');

            if (appTemplateGlue.$route.matched.length == 0) {
                this.router.push('/groups')
            }
        });

    }
}

export default Wrapper;


