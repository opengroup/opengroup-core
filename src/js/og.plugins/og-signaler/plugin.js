import Plugin from 'OpenGroup/Plugin';

/**
 * An OpenGroup Og Signaler plugin.
 */
class OgSignaler extends Plugin {

    name = 'og-signaler';
    endpoints = [];
    returnAnswerCallbacks = {};

    /**
     * @param group.
     * @param config.
     * @constructor
     */
    constructor (group, config = {}) {
        super();
        this.config = {};
        Object.assign(this.config, config);
        this.group = group;
    }

    connectionButtons () {
        return [{
            'name': 'og-signaler.join-url',
            'title': 'Join a group by an url',
            'callback': () => {
                alert('test')
            }
        }];
    }

    addUrl (url) {
        var ws = new WebSocket(url);
        this.endpoints.push(ws);

        ws.onopen = (event) => {
            ws.send(JSON.stringify({
                command: 'identify',
                uuid: this.group.uuid
            }));
        };

        ws.onmessage = (event) => {
            var message = JSON.parse(event.data);

            if (message.command == 'create-offer') {
                var connectedUuids = this.group.connections.map((myConnection) => myConnection.uuid);
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
                                    uuid: this.group.uuid,
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
                                uuid: this.group.uuid,
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
