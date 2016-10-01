import Events from '../base/Events.js';

/**
 * ConfigService.
 */
class ConfigService extends Events {
  /**
   * @constructor
   */
  constructor (connectionBus, config) {
    super();

    this.prefix = config.prefix;
    this.connectionBus = connectionBus;
  }

  get (name) {
    return JSON.parse(sessionStorage.getItem(this.prefix + '-' + name));
  }

  set (name, value) {
    sessionStorage.setItem(this.prefix + '-' + name, JSON.stringify(value));
  }
}

export default ConfigService;
