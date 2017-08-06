import EventEmitter from 'events';
import Vue from 'vue/dist/vue.common';
import _ from 'underscore';

class RouteManager extends EventEmitter {

    constructor (wrapper) {
        super();
        this.wrapper = wrapper;
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
                        component: {
                            template: `<h1>Group settings</h1>`
                        }
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
                                <h1>{{ title }}</h1>
                                <vue-form-generator tag="div" :schema="schema" :model="model" :options="formOptions">
                                </vue-form-generator>
                            </div>`,
                            watch: {
                                // This is neede else the whole form get's 'cached'.
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
}

export default RouteManager;