import Events from '../../base/Events.js';

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
