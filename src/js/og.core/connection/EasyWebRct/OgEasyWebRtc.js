import Events from 'src/js/og.core/base/Events';
import EasyWebRtc from 'src/js/og.core/connection/EasyWebRct/EasyWebRtc';
import OgEasyWebRtcSignalerManuel from 'src/js/og.core/connection/EasyWebRct/OgEasyWebRtcSignalerManuel';
import OgEasyWebRtcSignalerTest from 'src/js/og.core/connection/EasyWebRct/OgEasyWebRtcSignalerTest';

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

    if (this.config.events && this.config.events.length) {
      this.config.events.forEach((eventArray) => {
        this.on(eventArray[0], eventArray[1]);
      });
    }

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
