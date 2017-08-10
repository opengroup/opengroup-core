import Plugin from 'OpenGroup/core/Plugin';

/**
 * An OpenGroup multichat plugin.
 */
class Group extends Plugin {

    label = 'Group';
    description = 'Lorem ipsum';
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
            component: 'group-settings',
            subPath: 'settings',
            weight: 999
        }];
    }

}

export default Group;
