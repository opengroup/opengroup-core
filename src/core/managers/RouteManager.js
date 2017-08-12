import EventEmitter from 'events';
import Vue from 'vue/dist/vue.common';
import _ from 'underscore';

class RouteManager extends EventEmitter {

    constructor (wrapper) {
        super();
        this.wrapper = wrapper;

        this.wrapper.on('preReady', () => {
            this.wrapper.router.afterEach((to, from) => {
                if (to.name === 'groups.group') {
                    this.wrapper.router.push(this.wrapper.menuManager.getFirstMenuItem(to.path));
                }

                setTimeout(() => {
                    document.body.dataset.currentRoute = to.name;
                    document.body.dataset.currentDepth = to.path.split('/').length - 1;
                }, 100);
            })
        })
    }

    getAppRoutes () {
        let routeManager = this;
        let wrapper = this.wrapper;

        return [
            {
                path: '/groups',
                alias: '/',
                name: 'groups',
                title: 'Groups',
                component: Vue.options.components['groups']
            },
            {
                path: '/add-group',
                alias: '/',
                name: 'add-group',
                title: 'Add group',
                component: Vue.options.components['add-group'],
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
                            </div>`,
                            watch: {
                                // This is needed else the whole form get's 'cached'.
                                '$route': function() {
                                    Object.assign(this, routeManager.createSettingsRoute(this));
                                },
                            },
                            data: function () {
                                return routeManager.createSettingsRoute(this);
                            }
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
                title: settingsFormInfo.title,
                model: currentGroup.config.plugins[plugin.name],
                schema: {
                    fields: [...settingsFormInfo.schema, {
                        type: 'submit',
                        onSubmit: () => {
                            plugin.saveSettings();
                        },
                        validateBeforeSubmit: true,
                        buttonText: 'Save settings'
                    }]
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