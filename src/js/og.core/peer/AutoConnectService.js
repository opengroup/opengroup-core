import Events from '../../og.core/base/Events.js';

/**
 * PeerService.
 */
class AutoConnectService extends Events {
  /**
   * @constructor
   */
  constructor (connectionBus) {
    super();

    this.connectionBus = connectionBus;

    this.channeledConnections = {};

    this.connectionBus.on('newConnection', (newConnection) => {
      this.newConnection = newConnection;

      this.connectionBus.connections.forEach((connection) => {
        if (connection != newConnection) {
          connection.sendMessage({
            identifier: 'AutoConnect',
            command: 'sendOffer'
          })
        }
      });
    });

    this.connectionBus.on('message', (message, connection) => {
      if (message.identifier && message.identifier == 'AutoConnect') {

        // Left person.
        if (message.command && message.command == 'sendOffer') {
          this.preparedConnection = this.connectionBus.add({
            type: 'OgEasyWebRtc',
            config: {
              signaler: {
                type: 'OgEasyWebRtcSignalerManuel',
                config: {
                  role: 'initiator',
                }
              }
            }
          });

          this.preparedConnection.signaler.on('createdOffer', (data) => {
            this.preparedConnectionCallback = data.callback;
            connection.sendMessage({
              identifier: 'AutoConnect',
              command: 'passThroughOffer',
              offer: btoa(JSON.stringify(data.offer.toJSON()))
            });
          });
        }

        // Middleman
        if (message.command && message.command == 'passThroughOffer') {
          var stamp = Date.now();

          this.channeledConnections[stamp] = connection;

          this.newConnection.sendMessage({
            identifier: 'AutoConnect',
            command: 'createAnswer',
            offer: message.offer,
            stamp: stamp
          });
        }

        // Right person.
        if (message.command && message.command == 'createAnswer') {
          var offer = JSON.parse(atob(message.offer));
          var newGroupConnection = this.connectionBus.add({
            type: 'OgEasyWebRtc',
            config: {
              signaler: {
                type: 'OgEasyWebRtcSignalerManuel',
                config: {
                  role: 'answerer',
                  offer: offer,
                }
              }
            }
          });

          newGroupConnection.signaler.on('createdAnswer', (data) => {
            connection.sendMessage({
              identifier: 'AutoConnect',
              command: 'passThroughAnswer',
              answer: btoa(JSON.stringify(data.answer.toJSON())),
              oldStamp: message.stamp
            });
          });
        }

        // Middleman
        if (message.command && message.command == 'passThroughAnswer') {
          this.channeledConnections[message.oldStamp].sendMessage({
            identifier: 'AutoConnect',
            command: 'acceptAnswer',
            answer: message.answer,
            oldStamp: message.stamp
          });
        }

        // Left person
        if (message.command && message.command == 'acceptAnswer') {
          var answer = JSON.parse(atob(message.answer));
          this.preparedConnectionCallback(answer);
        }
      }
    });
  }

}

export default AutoConnectService;
