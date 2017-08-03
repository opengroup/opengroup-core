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

        return [
            {
                path: '/groups/' + this.group.slug + '/settings',
                title: 'Settings',
                weight: 1000,
                components: {
                    main: {
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
                        template: GroupSettingsTemplate
                    }
                },
            }
        ];
    }


}

export default Group;
