import {EventEmitter} from './../base/EventEmitter.js';

export class ConnectionsHeapStorage extends EventEmitter {

    constructor () {
        super();
        this.connections = [];
        this.heap = {}
    }

    getItem (key) {
        return this.heap[key];
    }

    setItem (key, value) {
        this.heap[key] = value;
    }

    getExternalItems (key) {
        let promises = [];

        this.connections.forEach(connection => {
            let replyPromise = connection.sendMessageAndPromisifyReply({
                module: 'storage',
                method: 'getItem',
                arguments: [key]
            });

            promises.push(replyPromise);
        });

        return promises;
    }

    addConnection (connection) {
        if (!this.connections.includes(connection)) {
            this.connections.push(connection); 
        }
    }
}