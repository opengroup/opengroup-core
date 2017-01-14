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
    }

    getName () {
        return this.name ? this.name : 'undefined';
    }

}

export default Plugin;
