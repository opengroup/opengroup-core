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
            label: 'Name',
            model: 'name',
            required: true
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
        });

        if (plugin.instance.settingsForm) {
            let pluginSettingsForm = plugin.instance.settingsForm();
            pluginSettingsForm.schema.forEach((field) => {
                field.visible = () => {
                    return model.plugins[plugin.instance.name].enabled
                };
                field.model = 'plugins.' + plugin.instance.name + '.' + field.model;
                schema.fields.push(field);
            })
        }
    });

    schema.fields.push({
        type: 'submit',
        onSubmit: () => {
            _(model.plugins).each((pluginDefinition) => {
                delete pluginDefinition.enabled;
            });

            if (!model.uuid) {
                model.uuid = model.name.toLowerCase().replace(/ /g, '-');
            }

            if (!model.slug) {
                model.slug = model.name.toLowerCase().replace(/ /g, '-');
            }

            wrapper.groupManager.addGroup(model);
            wrapper.router.push('/groups/' + model.slug);
        },
        validateBeforeSubmit: true,
        buttonText: 'Add group'
    });

    return {
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