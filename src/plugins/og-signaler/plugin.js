import Plugin from 'OpenGroup/core/Plugin';
import OgSignalerSettingsTemplate from './templates/og-signaler.html!text';

/**
 * An OpenGroup Og Signaler plugin.
 */
class OgSignaler extends Plugin {

    name = 'og-signaler';
    endpoints = [];
    returnAnswerCallbacks = {};
    config = {};

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

        if (typeof this.config.url == 'string') {
            this.group.on('ready', () => {
                this.addUrl(this.config.url);
            })
        }
    }

    groupSubRoutes (group) {
        var plugin = this;

        return [
            {
                path: '/groups/' + group.slug + '/settings/og-signaler',
                title: 'Connect via a signaler',
                weight: 1000,
                components: {
                    main: {
                        data: function () {
                            return {
                                signalerUrl: plugin.pluginData.url
                            }
                        },
                        methods: {
                            saveSettings: function () {

                            }
                        },
                        template: OgSignalerSettingsTemplate
                    }
                },
            }
        ];
    }

    addUrl (url) {
        var ws = new WebSocket('ws://' + url);
        this.endpoints.push(ws);

        ws.onopen = (event) => {
            ws.send(JSON.stringify({
                command: 'identify',
                uuid: this.group.lid
            }));
        };

        ws.onmessage = (event) => {
            var message = JSON.parse(event.data);

            if (message.command == 'create-offer') {
                var connectedUuids = this.group.connections.map((connection) => connection.uuid);
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

            if (message.command == 'create-answer') {
                var offer = JSON.parse(atob(message.offer));

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

            if (message.command == 'accept-answer') {
                var answer = JSON.parse(atob(message.answer));
                this.returnAnswerCallbacks[message.uuid](answer);
            }

        };
    }

}

export default OgSignaler;
