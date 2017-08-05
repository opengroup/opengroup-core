import EventEmitter from 'events';
import Vue from 'vue/dist/vue.common';
import _ from 'underscore';

class RouteManager extends EventEmitter {

    constructor (wrapper) {
        super();
        this.wrapper = wrapper;
    }

    getAppRoutes () {
        let routes = [
            {
                path: '/groups',
                alias: '/',
                name: 'groups',
                title: 'Groups',
                components: {
                    sidebar: Vue.options.components['sidebar']
                },
            },
            {
                path: '/about',
                name: 'about',
                title: 'About OpenGroup',
                components: {
                    main: Vue.options.components['about']
                }
            }
        ];

        this.emit('routesAlter', routes);

        return routes;
    }

    createGroupRoutes () {
        let groupRoutes = [];
        let groups = this.wrapper.groupManager.getGroups();

        // Maybe you wonder why we don't use dynamic routes,
        // it has to do with allowing different versions of one plugin in two groups,
        // maybe it is still possible to use dynamic loading, it think it would get quite complex,
        // but please prove me wrong with a pull request.

        groups.forEach((group) => {
            groupRoutes.push({
                path: '/groups/' + group.slug,
                name: group.slug,
                meta: {
                    group: group,
                },
                title: group.config.name,
                components: {
                    sidebar: Vue.options.components['sidebar'],
                    header: Vue.options.components['group-header'],
                }
            });

            groupRoutes.push({
                path: '/groups/' + group.slug + '/settings',
                name: group.slug + ':settings',
                meta: {
                    group: group,
                },
                title: 'Settings',
                components: {
                    sidebar: Vue.options.components['sidebar'],
                    header: Vue.options.components['group-header'],
                    main: Vue.options.components['group-settings'],
                }
            });

            // Setting forms for plugins.
            _.forEach(group.plugins, (plugin) => {
                if (typeof plugin.routes === 'function') {
                    plugin.routes().forEach((route) => {
                        groupRoutes.push(route);
                    });
                }
            });

            // Setting forms for plugins.
            _.forEach(group.plugins, (plugin) => {
                if (typeof plugin.settingsForm === 'function') {
                    groupRoutes.push(this.createPluginSettingsRoute(plugin, group));
                }
            });

            // SubRoutes of plugins
            _.forEach(group.plugins, (plugin) => {
                if (typeof plugin.groupSubRoutes === 'function') {
                    plugin.groupSubRoutes().forEach((subRoute) => {
                        subRoute.path = '/groups/' + group.slug + subRoute.subPath;
                        subRoute.components = {};
                        subRoute.components.sidebar = Vue.options.components['sidebar'];
                        subRoute.components.header = Vue.options.components['group-header'];
                        subRoute.components.main = {
                            template: subRoute.template,
                            data: subRoute.data,
                            methods: subRoute.methods,
                        };
                        subRoute.meta = { group: group };

                        groupRoutes.push(subRoute);
                    });
                }
            });
        });

        return groupRoutes;
    }

    createPluginSettingsRoute (plugin, group) {
        let settingsFormInfo = plugin.settingsForm();

        return {
            path: '/groups/' + group.slug + '/settings/' + settingsFormInfo.path,
            name: group.slug + ':' + plugin.name,
            title: settingsFormInfo.title,
            meta: {
                group: group,
            },
            components: {
                sidebar: Vue.options.components['sidebar'],
                header: Vue.options.components['group-header'],
                main: {
                    template: `<div>
                        <h1>{{ title }}</h1>
                        <vue-form-generator tag="div" :schema="schema" :model="model" :options="formOptions">
                        </vue-form-generator>
                    </div>`,
                    data: function () {
                        return {
                            title: settingsFormInfo.title,
                            model: group.config.plugins[plugin.name],
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
                }
            }
        }
    }

    getRoutes () {
        return [...this.getAppRoutes(), ...this.createGroupRoutes()];
    }
}

export default RouteManager;