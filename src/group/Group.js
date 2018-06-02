import { EventEmitter } from './../base/EventEmitter.js';

export class Group extends EventEmitter {
  constructor() {
    super();
    this.peers = new Set();
    this.modules = {};
  }

  addPeer(peer) {
    this.peers.add(peer);
  }

  /**
   * A group can have modules like storage or a profile etc.
   * @param {*} name 
   * @param {*} moduleToAdd 
   */
  addModule(name, moduleToAdd) {
    this.modules[name] = moduleToAdd;
  }
}