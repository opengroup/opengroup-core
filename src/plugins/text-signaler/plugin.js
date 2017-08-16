import Plugin from 'OpenGroup/core/Plugin';

/**
 * An OpenGroup Og Signaler plugin.
 */
class TextSignaler extends Plugin {

    label = 'Signaler via text';
    description = 'Lorem ipsum';
    name = 'text-signaler';
    config = {};

    componentNames = [
        'manual-signaling'
    ];

    /**
     * @param group.
     * @param config.
     * @constructor
     */
    constructor (group, config = {}) {
        super();
        Object.assign(this.config, config);
        this.group = group;
    }

    getMenuItems () {
        return [{
            title: 'Connect via text',
            component: 'manual-signaling',
            subPath: 'settings/signaling-manual',
            weight: -9999
        }];
    }
}

export default TextSignaler;
