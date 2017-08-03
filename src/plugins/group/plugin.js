import Plugin from 'OpenGroup/core/Plugin';
import GroupSettingsTemplate from './templates/group-settings.html!text';

/**
 * An OpenGroup multichat plugin.
 */
class Group extends Plugin {

    name = 'group';
    config = {};

    /**
     * @param group.
     * @param config.
     * @constructor
     */
    constructor (group, config = {}) {
        super();
        this.group = group;
        Object.assign(this.config, config);
    }

    groupSubRoutes () {
        let plugin = this;

        return [{
            title: 'Group',
            subPath: '/settings/group',
            weight: 1000,
            template: GroupSettingsTemplate,
            data: function () {
                return {
                    groupName: plugin.group.config.name
                }
            },
            methods: {
                saveSettings: function () {
                    this.group.config.name = this.groupName;
                }
            },
        }];
    }

}

export default Group;
