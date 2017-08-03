import Plugin from 'OpenGroup/core/Plugin';
import OgWebRtc from './OgWebRtc.js';

/**
 * An OpenGroup webrtc plugin.
 */
class WebRtc extends Plugin {

    name = 'webrtc';
    config = {};

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

    settingsForm () {
        return {
            path: 'signaler-manual',
            title: 'Manual',
            schema: [{
                type: 'input',
                inputType: 'text',
                label: 'Answer',
                model: 'answer',
                required: true
            }]
        }
    }

    saveSettings () {

    }

}

export default WebRtc;
