import Events from '../../og.core/base/Events.js';

/**
 * PeerService.
 */
class AutoConnectService extends Events {
  /**
   * @constructor
   */
  constructor (connectionBus) {
    super();

    this.connectionBus = connectionBus;

  }

}

export default AutoConnectService;
