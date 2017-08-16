import Plugin from 'OpenGroup/core/Plugin';
import VueQrcode from 'xkeshi/vue-qrcode'
import Vue from 'vue/dist/vue.common';

/**
 * An OpenGroup Og Signaler plugin.
 */
class QrSignaler extends Plugin {

    label = 'Signaler via QR codes';
    description = 'Lorem ipsum';
    name = 'qr-signaler';
    config = {};

    componentNames = [
        'qr-signaling'
    ];

    /**
     * @param group.
     * @param config.
     * @constructor
     */
    constructor (group, config = {}) {
        super();
        Object.assign(this.config, config);
        this.group = group;
        Vue.component('qrcode', VueQrcode);
    }

    getMenuItems () {
        return [{
            title: 'Connect via QR codes',
            component: 'qr-signaling',
            subPath: 'settings/signaling-qr',
            weight: -9999
        }];
    }
}

export default QrSignaler;
