import EventEmitter from 'events';

/**
 * An OpenGroup is an object that holds peers and functions as a bus.
 */
class Plugin extends EventEmitter {

    /**
     * @param group.
     * @param config.
     * @constructor
     */
    constructor (group, config = {}) {
        super();
        this.config = {};
        Object.assign(this.config, config);

    }

    getName () {
        return this.name ? this.name : 'undefined';
    }

}

export default Plugin;
