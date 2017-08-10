import Plugin from 'OpenGroup/core/Plugin';

/**
 * An OpenGroup Og Signaler plugin.
 */
class OgSignaler extends Plugin {

    label = 'Signaler via URL';
    description = 'Lorem ipsum';
    name = 'og-signaler';
    endpoints = [];
    returnAnswerCallbacks = {};
    config = {};
    connectedUrls = [];

    /**
     * @param group.
     * @param config.
     * @constructor
     */
    constructor (group, config = {}) {
        super();
        Object.assign(this.config, config);
        this.group = group;
        this.pluginData = group.config.plugins['og-signaler'];
        if (!this.pluginData.url) {
            this.pluginData.url = '';
        }

        if (this.validWebsocketsUrl(this.config.url)) {
            this.group.on('ready', () => {
                this.addUrl(this.config.url);
            })
        }
    }

    // TODO add validation on the url.
    validWebsocketsUrl (url) {
        return typeof url === 'string' && !!url;
    }

    settingsForm () {
        return {
            path: 'signaler-url',
            title: 'Connect via an URL',
            schema: [{
                type: 'input',
                inputType: 'text',
                label: 'Server Websocket address',
                model: 'url',
                required: true
            }]
        }
    }

    saveSettings () {
        if (!this.connectedUrls.includes(this.pluginData.url) && this.validWebsocketsUrl(this.pluginData.url)) {
            this.addUrl(this.pluginData.url);
        }
    }

    addUrl (url) {
        let ws = new WebSocket('ws://' + url);
        this.endpoints.push(ws);
        this.connectedUrls.push(url);

        ws.onopen = (event) => {
            ws.send(JSON.stringify({
                command: 'identify',
                uuid: this.group.lid
            }));
        };

        ws.onmessage = (event) => {
            let message = JSON.parse(event.data);

            if (message.command === 'create-offer') {
                let connectedUuids = this.group.connections.map((connection) => connection.uuid);
                if (!connectedUuids.includes(message.uuid)) {

                    this.group.addPeer({
                        connectionType: 'og-webrtc',
                        signalerType: 'manual',
                        uuid: message.uuid,
                        signalerInfo: {
                            role: 'initiator',
                            offerCreated: (offer, returnAnswerCallback) => {
                                this.returnAnswerCallbacks[message.uuid] = returnAnswerCallback;
                                ws.send(JSON.stringify({
                                    command: 'pass-offer',
                                    uuid: this.group.lid,
                                    toUuid: message.uuid,
                                    offer: btoa(JSON.stringify(offer.toJSON()))
                                }));
                            },
                        }
                    });
                }
            }

            if (message.command === 'create-answer') {
                let offer = JSON.parse(atob(message.offer));

                this.group.addPeer({
                    connectionType: 'og-webrtc',
                    uuid: message.uuid,
                    signalerType: 'manual',
                    signalerInfo: {
                        role: 'answerer',
                        offer: offer,
                        answerCreated: (answer) => {
                            ws.send(JSON.stringify({
                                command: 'pass-answer',
                                uuid: this.group.lid,
                                toUuid: message.uuid,
                                answer: btoa(JSON.stringify(answer.toJSON()))
                            }));
                        }
                    }
                });
            }

            if (message.command === 'accept-answer') {
                let answer = JSON.parse(atob(message.answer));
                this.returnAnswerCallbacks[message.uuid](answer);
            }

        };
    }

}

export default OgSignaler;
