import Events from '../../base/Events.js';
import EasyWebRtc from '../../connection/EasyWebRct/EasyWebRtc.js';
import OgEasyWebRtcSignalerManuel from '../../connection/EasyWebRct/OgEasyWebRtcSignalerManuel.js';
import OgEasyWebRtcSignalerTest from '../../connection/EasyWebRct/OgEasyWebRtcSignalerTest.js';

var signalerTypes = {
  'OgEasyWebRtcSignalerManuel': OgEasyWebRtcSignalerManuel,
  'OgEasyWebRtcSignalerTest': OgEasyWebRtcSignalerTest
};

/**
 * OgEasyWebRtc is an object to easily construct a p2p connection.
 * Should be tight coupled.
 */
class OgEasyWebRtc extends Events {
  /**
   * @constructor
   */
  constructor (config = {}) {
    super();
    this.config = {
      signaler: {
        type: false,
        config: {}
      }
    };

    Object.assign(this.config, config);

    var signalerInfo = this.config.signaler;

    this.connection = new EasyWebRtc();
    this.signaler = new signalerTypes[signalerInfo.type](this.connection, signalerInfo.config);

    // Proxy the EasyWebRtc events to the OgEasyWebRtc.
    var proxyEvents = ['connected', 'message', 'closed', 'error'];

    proxyEvents.forEach((proxyEvent) => {
      this.connection.on(proxyEvent, (...args) => {
        this.fire(proxyEvent, ...args);
      });
    });
  }

  // Proxy sendMessage.
  sendMessage (message) {
    this.connection.sendMessage(message);
  }
}

export default OgEasyWebRtc;
