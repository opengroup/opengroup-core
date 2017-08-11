import EventEmitter from 'events';

class StorageManager extends EventEmitter {

    constructor (wrapper) {
        super();
        this.wrapper = wrapper;
    }

}

export default StorageManager;