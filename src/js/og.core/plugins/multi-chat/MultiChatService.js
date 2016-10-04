import Events from '../../../og.core/base/Events.js';

/**
 * MultiChatService.
 */
class MultiChatService extends Events {
  /**
   * @constructor
   */
  constructor (connectionBus) {
    super();

    this.messages = [];
    this.connectionBus = connectionBus;

    this.connectionBus.on('message', (message, connection) => {
      if (message.identifier && message.identifier === 'multiChat') {
        message.chatMessage.guid = connection.peer.identity.guid;
        this.addChatMessage(message.chatMessage);
      }
    });
  }

  addChatMessage (message) {
    this.messages.push(message);
    this.fire('newChatMessage');
  }

  getMessages () {
    return this.messages;
  }

}

export default MultiChatService;
