import { EventEmitter } from './../base/EventEmitter.js';

export class PeersHeapStorage extends EventEmitter {

  constructor(group) {
    super();
    this.heap = {};
    this.group = group;
    group.addModule('storage', this);

    this.allowedMethodsToReturnToOtherPeers = ['getItem'];
  }

  getItem(key) {
    return this.heap[key];
  }

  setItem(key, value) {
    this.heap[key] = value;
  }

  getExternalItems(key) {
    let promises = [];

    this.group.peers.forEach(peer => {
      let replyPromise = peer.sendCommandAndPromisifyResponse({
        module: 'storage',
        method: 'getItem',
        arguments: [key]
      });

      promises.push(replyPromise);
    });

    return promises;
  }
}