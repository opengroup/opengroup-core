import Plugin from 'OpenGroup/core/Plugin';

/**
 * An OpenGroup multichat plugin.
 */
class MultiConnect extends Plugin {

    label = 'MultiConnect';
    description = 'Lorem ipsum';
    name = 'multiconnect';
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

        this.channeledConnections = {};

        // Middleman gets a new connection and introduces the friend to all the other friends.
        this.group.on('newConnection', (newConnection) => {
            this.newConnection = newConnection;

            this.group.connections.forEach((connection) => {
                if (connection.uuid != newConnection.uuid) {
                    connection.sendMessage({
                        owner: this.getName(),
                        command: 'sendOffer',
                        uuid: newConnection.uuid
                    })
                }
            });
        });

        this.group.on(this.getName() + '.message', (message, connection) => {
            // Left person gets a request if she knows a certain person.
            if (message.command === 'sendOffer') {
                var connectedUuids = this.group.connections.map((myConnection) => myConnection.uuid);

                if (!connectedUuids.includes(message.uuid)) {
                    this.group.addPeer({
                        connectionType: 'og-webrtc',
                        signalerType: 'manual',
                        uuid: message.uuid,
                        signalerInfo: {
                            role: 'initiator',
                            offerCreated: (offer, returnAnswerCallback) => {
                                this.returnAnswerCallback = returnAnswerCallback;
                                connection.sendMessage({
                                    owner: this.getName(),
                                    command: 'passThroughOffer',
                                    uuid: this.group.uuid,
                                    offer: btoa(JSON.stringify(offer.toJSON()))
                                });
                            },
                        }
                    });
                }
            }

            // Middleman
            if (message.command === 'passThroughOffer') {
                this.channeledConnections[connection.uuid] = connection;

                this.newConnection.sendMessage({
                    owner: this.getName(),
                    command: 'createAnswer',
                    offer: message.offer,
                    uuid: message.uuid
                });
            }

            // Right person.
            if (message.command === 'createAnswer') {
                var offer = JSON.parse(atob(message.offer));
                this.group.addPeer({
                    connectionType: 'og-webrtc',
                    uuid: message.uuid,
                    signalerType: 'manual',
                    signalerInfo: {
                        role: 'answerer',
                        offer: offer,
                        answerCreated: (answer) => {
                            connection.sendMessage({
                                owner: this.getName(),
                                command: 'passThroughAnswer',
                                answer: btoa(JSON.stringify(answer.toJSON())),
                                uuid: this.group.uuid
                            });
                        }
                    }
                });
            }

            // Middleman
            if (message.command === 'passThroughAnswer') {
                this.channeledConnections[message.uuid].sendMessage({
                    owner: this.getName(),
                    command: 'acceptAnswer',
                    answer: message.answer
                });
            }

            // Left person
            if (message.command === 'acceptAnswer') {
                var answer = JSON.parse(atob(message.answer));
                this.returnAnswerCallback(answer);
            }
        });
    }

}

export default MultiConnect;
