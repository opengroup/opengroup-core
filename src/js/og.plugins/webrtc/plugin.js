import Plugin from '../../og.core/Plugin.js';
import OgWebRtc from './OgWebRtc.js';

/**
 * An OpenGroup webrtc plugin.
 */
class WebRtc extends Plugin {

    name = 'webrtc';

    /**
     * @param group.
     * @param config.
     * @constructor
     */
    constructor (group, config = {}) {
        super();
        this.config = {};
        Object.assign(this.config, config);
        group.connectionTypes['og-webrtc'] = OgWebRtc;
    }


}

export default WebRtc;
