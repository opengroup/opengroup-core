import {EventEmitter} from './../base/EventEmitter.js';

export class PeersHeapStorage extends EventEmitter {

    constructor () {
        super();
        this.peers = [];
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

        this.peers.forEach(peer => {
            let replyPromise = peer.sendMessageAndPromisifyReply({
                module: 'storage',
                method: 'getItem',
                arguments: [key]
            });

            promises.push(replyPromise);
        });

        return promises;
    }

    addPeer (peer) {
        if (!this.peers.includes(peer)) {
            this.peers.push(peer);
            if (peer.modules) peer.addModule('storage', this);
        }
    }
}