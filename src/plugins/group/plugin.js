import Plugin from 'OpenGroup/core/Plugin';
import GroupSettingsTemplate from './templates/group-settings.html!text';

/**
 * An OpenGroup multichat plugin.
 */
class Group extends Plugin {

    name = 'group';
    config = {};

    componentNames = [
        'group-settings'
    ];

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

    getMenuItems () {
        return [{
            title: 'Settings',
            path: '/groups/' + this.group.slug + '/group-settings'
        }];
    }

}

export default Group;
