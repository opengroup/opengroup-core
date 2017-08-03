import EventEmitter from 'events';
import Vue from 'vue/dist/vue.common';
import _ from 'underscore';

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
                components: {
                    sidebar: Vue.options.components['group-list'],
                    header: Vue.options.components['group-header'],
                }
            });

            // Setting forms for plugins.
            _.forEach(group.plugins, (plugin) => {
                if (typeof plugin.settingsForm === 'function') {
                    groupRoutes.push(this.createPluginSettingsRoute(plugin, group));
                }
            })
        });

        return groupRoutes;
    }

    createPluginSettingsRoute (plugin, group) {
        let settingsFormInfo = plugin.settingsForm();

        return {
            path: '/groups/' + group.slug + '/settings/' + settingsFormInfo.path,
            name: group.slug + ':' + plugin.name,
            meta: {
                group: group,
            },
            components: {
                sidebar: Vue.options.components['group-list'],
                header: Vue.options.components['group-header'],
                main: {
                    template: `<div>
                        <h1>{{ title }}</h1>
                        <vue-form-generator :schema="schema" :model="model" :options="formOptions">
                        </vue-form-generator>
                    </div>`,
                    data: function () {
                        return {
                            title: settingsFormInfo.title,
                            model: group.config.plugins[plugin.name],
                            schema: {
                                fields: [...settingsFormInfo.schema, {
                                    'type': 'submit',
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
                                fieldIdPrefix: plugin.name
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