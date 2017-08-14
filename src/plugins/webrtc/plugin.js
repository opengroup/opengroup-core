import Plugin from 'OpenGroup/core/Plugin';
import OgWebRtc from './OgWebRtc.js';

/**
 * An OpenGroup webrtc plugin.
 */
class WebRtc extends Plugin {

    label = 'WebRTC';
    description = 'Lorem ipsum';
    name = 'webrtc';
    config = {};

    componentNames = [
        'manual-signaling'
    ];

    /**
     * @param group.
     * @param config.
     * @constructor
     */
    constructor (group, config = {}) {
        super();
        Object.assign(this.config, config);
        group.connectionTypes['og-webrtc'] = OgWebRtc;
    }

    getMenuItems () {
        return [{
            title: 'Connect via text',
            component: 'manual-signaling',
            subPath: 'settings/signaling-manual',
            weight: -9999
        }];
    }

}

export default WebRtc;
