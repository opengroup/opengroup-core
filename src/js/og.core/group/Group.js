import Events from 'src/js/og.core/base/Events';
import ConnectionBus from 'src/js/og.core/connection/ConnectionBus';
import PeerService from 'src/js/og.core/peer/PeerService';

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
  }
}

export default Group;
