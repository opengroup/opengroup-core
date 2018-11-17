import { EventEmitter } from './../base/EventEmitter.js';
import { Peer } from './../peer/Peer.js';
import { EasyP2P } from './../connection/EasyP2P.js';
import { importModule } from "https://uupaa.github.io/dynamic-import-polyfill/importModule.js";

export class Group extends EventEmitter {
  constructor(manifest = null) {
    super();
    this.peers = new Set();
    this.modules = {};

    if (manifest) {
      this.manifest = manifest;
    }

    let importPromises = [];
    if (this.manifest && this.manifest.modules) {
      for (let [moduleImportPath, moduleConfig] of Object.entries(this.manifest.modules)) {
        let importName = 'default';
        if (moduleImportPath.split('|').length === 2) {
          importName = moduleImportPath.split('|')[1];
          moduleImportPath = moduleImportPath.split('|')[0];
        }

        importPromises.push(
          importModule(moduleImportPath + '/plugin.js')
          .then(fetchedModule => fetchedModule[importName] || false)
          .then(moduleClass => moduleClass ? new moduleClass(this, moduleConfig) : false)
        );
      }

      Promise.all(importPromises).then(() => {
        this._ready = true;
        this.emit('loaded');
      });
    }

    // If no promises, just go on.
    if (!importPromises.length) this.emit('loaded');
  }

  set manifest(manifest) {
    this._manifest = manifest;
    this.emit('manifest-set', manifest);
  }

  get manifest() {
    return this._manifest;
  }

  get name() {
    return this._manifest.name;
  }

  get label() {
    return this._manifest.label;
  }

  addPeer(peer) {
    this.peers.add(peer);
    this.emit('peer-add', peer);
  }

  /**
   * A group can have modules like storage or a profile etc.
   * @param {*} name
   * @param {*} moduleToAdd
   */
  addModule(moduleToAdd) {
    this.modules[moduleToAdd.name] = moduleToAdd;
    this.emit('module-add', name, moduleToAdd);
  }

  /**
   * Send a message to all other peers.
   * @param {*} message
   */
  broadcast(message) {
    this.peers.forEach(peer => {
      peer.connection.sendMessage(message);
    });
  }
}

/**
 * Helper for writing tests.
 * @param {*} callback (peer1, peer2)
 */
export let initiateGroup = (callback, groupManifest1 = null, groupManifest2 = null) => {
  // The external side of the connection.
  let connection2;
  let peer2;
  let group2 = new Group(groupManifest2);

  // The local side of the connection.
  let peer1;
  let group1 = new Group(groupManifest1);
  let connection1 = new EasyP2P({
    role: 'initiator',
  }).on('offer-ready', offerSdp => {

    connection2 = new EasyP2P({
        role: 'answerer',
        initialOffer: offerSdp,
      })
      .on('answer-ready', answerSdp => connection1.acceptAnswer(answerSdp))
      .on('started', () => {
        peer2 = new Peer(connection2, group2);
        callback(peer1, peer2);
      })

  }).on('started', () => {
    peer1 = new Peer(connection1, group1);
  });
};