import Events from 'src/js/og.core/base/Events';

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
    return localStorage.getItem(this.prefix + '-' + name);
  }

  set (name, value) {
    localStorage.setItem(this.prefix + '-' + name, value);
  }
}

export default ConfigService;