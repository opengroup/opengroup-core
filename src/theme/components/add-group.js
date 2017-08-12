import _ from 'underscore';

import Group from 'OpenGroup/plugins/group/plugin';
import MultiChat from 'OpenGroup/plugins/multichat/plugin';
import MultiConnect from 'OpenGroup/plugins/multiconnect/plugin';
import OgSignaler from 'OpenGroup/plugins/og-signaler/plugin';
import WebRTC from 'OpenGroup/plugins/webrtc/plugin';

import OpenGroup from 'OpenGroup/core/OpenGroup';


export default function (wrapper) {

    let plugins = [
        {
            className: Group,
            required: true
        },
        {
            className: MultiChat,
            required: false
        },
        {
            className: MultiConnect,
            required: false
        },
        {
            className: OgSignaler,
            required: false
        },
        {
            className: WebRTC,
            required: true
        }
    ];

    let schema = {
        fields: [{
            type: 'input',
            inputType: 'text',
            model: 'name',
            label: 'What is the name of the group?',
            required: true
        }, {
            type: "label",
            label: "Plugins"
        }],
    };

    let model = {
        plugins: {}
    };

    let newGroup = new OpenGroup(wrapper, {
        'name': 'Unnamed',
        'uuid': 'unnamed',
        'plugins': {
            'og-signaler': {},
            'webrtc': {},
            'multichat': {},
            'group': {},
            'multiconnect': {}
        }
    });

    _(plugins).each((plugin) => {
        plugin.instance = new plugin.className(newGroup, {});

        model.plugins[plugin.instance.name] = {
            enabled: plugin.required
        };

        schema.fields.push({
            type: 'checkbox',
            label: plugin.instance.label,
            model: 'plugins.' + plugin.instance.name + '.enabled',
            default: plugin.required,
            disabled: plugin.required,
            styleClasses: 'inline'
        });

        if (plugin.instance.settingsForm) {
            let pluginSettingsForm = plugin.instance.settingsForm();
            pluginSettingsForm.schema.forEach((field) => {
                field.visible = () => {
                    return model.plugins[plugin.instance.name].enabled
                };
                field.styleClasses = 'inside-plugin';
                field.model = 'plugins.' + plugin.instance.name + '.' + field.model;
                schema.fields.push(field);
            })
        }
    });

    return {
        methods: {
            submitGroup: () => {
                let groupDefinition = JSON.parse(JSON.stringify(model));
                _(groupDefinition.plugins).each((pluginDefinition, pluginName) => {
                    if (!pluginDefinition.enabled) {
                        delete groupDefinition.plugins[pluginName];
                    }
                    else {
                        delete pluginDefinition.enabled;
                    }
                });

                if (!groupDefinition.uuid) {
                    groupDefinition.uuid = groupDefinition.name.toLowerCase().replace(/ /g, '-');
                }

                if (!groupDefinition.slug) {
                    groupDefinition.slug = groupDefinition.name.toLowerCase().replace(/ /g, '-');
                }

                wrapper.groupManager.addGroup(groupDefinition);
                wrapper.router.push('/groups/' + groupDefinition.slug);
            },
        },
        data: function () {
            return {
                model: model,
                schema: schema,
                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true,
                }
            }
        }
    }
};