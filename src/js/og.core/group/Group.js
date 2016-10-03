import Events from '../../og.core/base/Events.js';
import ConnectionBus from '../../og.core/connection/ConnectionBus.js';
import PeerService from '../../og.core/peer/PeerService.js';
import AutoConnectService from '../../og.core/peer/AutoConnectService.js';

/**
 * Group
 */
class Group extends Events {
  /**
   * @constructor
   */
  constructor (config) {
    super();
    this.id = config.id;
    this.label = config.label;

    this.connectionBus = new ConnectionBus(this);
    this.connectionBus.addService('peer', PeerService);
    this.connectionBus.addService('auto-connect', AutoConnectService);
  }

  getService (name) {
    if (this.connectionBus.services[name]) {
      return this.connectionBus.services[name];
    }
  }
}

export default Group;
