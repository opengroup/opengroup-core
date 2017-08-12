import EventEmitter from 'events';
import Vue from 'vue/dist/vue.common';
import _ from 'underscore';

class RouteManager extends EventEmitter {

    constructor (wrapper) {
        super();
        this.wrapper = wrapper;

        this.wrapper.on('preReady', () => {
            this.wrapper.router.afterEach((to, from) => {
                if (to.name === 'groups.group' || to.name === 'groups.group.settings') {
                    let firstMenuItemPath = this.wrapper.menuManager.getFirstMenuItemPath(to.path);
                    if (firstMenuItemPath) {
                        this.wrapper.router.push(firstMenuItemPath);
                    }
                }

                document.body.dataset.currentRoute = to.name;
                document.body.dataset.currentDepth = to.path.split('/').length - 1;
            })
        })
    }

    getAppRoutes () {
        let routeManager = this;
        let wrapper = this.wrapper;

        return [
            {
                path: '/add-group',
                alias: '/',
                name: 'add-group',
                title: 'Add group',
                component: Vue.options.components['add-group'],
            },
            {
                path: '/groups',
                alias: '/',
                name: 'groups',
                title: 'Groups',
                component: Vue.options.components['group'],
            },
            {
                path: '/groups/:slug',
                name: 'groups.group',
                title: 'Group',
                component: Vue.options.components['group'],
                beforeEnter (to, from, next) {
                    // Let's see if our group is ready, in other words,
                    // has loaded all the plugins and their components.
                    let checkState = () => {
                        let currentGroup = wrapper.groupManager.getGroupBySlug(to.params.slug);
                        if (currentGroup && currentGroup.state === 'ready') {
                            return next();
                        }

                        setTimeout(checkState, 100);
                    };

                    checkState();
                },
                children: [
                    {
                        path: 'settings',
                        name: 'groups.group.settings',
                        weight: -99,
                        title: 'Plugin',
                        component: Vue.options.components['group-settings'],
                    },
                    {
                        path: ':plugin',
                        name: 'groups.group.plugin',
                        title: 'Plugin',
                        component: {
                            template: `<component :is="componentName"></component>`,
                            data: function () {
                                let currentGroup = wrapper.groupManager.getCurrentGroup();
                                let currentMenuItem = currentGroup.menuItems.filter((menuItem) => menuItem.subPath === this.$route.params.plugin)[0];

                                return {
                                    componentName: currentMenuItem.component
                                };
                            }
                        }
                    },
                    {
                        path: 'settings/:plugin',
                        name: 'groups.group.settings.plugin',
                        title: 'Plugin',
                        component: {
                            template: `
                            <div>
                                <h1 class="plugin-title">{{ title }}</h1>
                                <vue-form-generator tag="div" :schema="schema" :model="model" :options="formOptions">
                                </vue-form-generator>
                                
                                <div class="form-actions">
                                    <div class="button primary" @click="save"><i class="fa fa-check" aria-hidden="true"></i> Save settings</div>
                                </div>
                            </div>`,
                            watch: {
                                // This is needed else the whole form get's 'cached'.
                                '$route': function() {
                                    Object.assign(this, routeManager.createSettingsRoute(this));
                                },
                            },
                            data: function () {
                                return routeManager.createSettingsRoute(this);
                            },
                            methods: {
                                save: function () {
                                    this.plugin.saveSettings();
                                    let currentGroup = wrapper.groupManager.getCurrentGroup();
                                    wrapper.router.push('/groups/' + currentGroup.slug);
                                }
                            },
                        }
                    },
                ]
            },
            {
                path: '/about',
                name: 'about',
                title: 'About OpenGroup',
                component: Vue.options.components['about']
            },
            {
                path: '/profile',
                name: 'profile',
                title: 'Your profile',
                component: Vue.options.components['profile']
            }
        ];
    }

    createSettingsRoute (context) {
        let currentGroup = this.wrapper.groupManager.getCurrentGroup();
        let plugin = currentGroup.plugins[context.$route.params.plugin];

        if (typeof plugin.settingsForm === 'function') {
            let settingsFormInfo = plugin.settingsForm();

            return {
                plugin: plugin,
                title: settingsFormInfo.title,
                model: currentGroup.config.plugins[plugin.name],
                schema: {
                    fields: settingsFormInfo.schema
                },
                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true,
                    fieldIdPrefix: plugin.name,
                }
            }
        }

        // Plugin has no settings form.
        else {
            return {}
        }
    }

    getUrlParameter (name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        // example.com/#/?foo=bar
        let results = regex.exec('?' + location.hash.split('?')[1]);

        // example.com?foo=bar/#/
        if (!results) {
            results = regex.exec('?' + location.search);
        }

        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

}

export default RouteManager;