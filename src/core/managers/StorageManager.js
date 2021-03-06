import EventEmitter from 'events';
import Dexie from 'dexie';
import _ from 'underscore';

class StorageManager extends EventEmitter {

    constructor (wrapper) {
        super();
        this.wrapper = wrapper;

        this.db = new Dexie('opengroup');
        let storesData = { 1: {} };

        this.wrapper.on('ready', () => {
            this.emit('defineStores', storesData);
            _(storesData).each((version, stores) => {
                this.db.version(version).stores(stores);
            });
        });
    }

}

export default StorageManager;