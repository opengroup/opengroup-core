import Events from 'src/js/og.core/base/Events';

/**
 * OgEasyWebRtcSignalerManuel is a webrtc signaler.
 */
class OgEasyWebRtcSignalerManuel extends Events {
  /**
   * @constructor
   */
  constructor (config = {}) {
    super();
    this.config = {};
    Object.assign(this.config, config);
  }
}

export default OgEasyWebRtcSignalerManuel;
