import { EventEmitter } from './../base/EventEmitter.js';
import { Guid } from './../base/Guid.js';

export class Peer extends EventEmitter {
  constructor(connection, group = null) {
    super();
    this.connection = connection;
    this.id = Guid();
    this.group = group;
    group.addPeer(this);

    this.connection.on('message', (message) => {
      // The other side of sendMessageAndPromisifyReply.
      if (message.mustReply && message.module && this.group && this.group.modules[message.module] && message.method && this.group.modules[message.module][message.method]) {
        let access = this.group.modules[message.module].allowedMethodsToReturnToOtherPeers.includes(message.method);

        if (access) {
          let result = this.group.modules[message.module][message.method](...message.arguments || []);

          this.connection.sendMessage({
            originatedFromGuid: message.guid,
            result: result
          });
        }
      }

      this.group.emit('message', message, this);
    });
  }

  /**
   * Tags a message so we can pick up the answer and return it as a promise
   */
  sendMessageAndPromisifyReply(message) {
    if (!message.module || !message.method) throw 'The message for sendMessageAndPromisifyReply is malformed!';

    let guid = Guid();

    message.guid = guid;
    message.mustReply = true;

    return new Promise((resolve, reject) => {
      let onMessageTillReplied = replyMessage => {
        if (replyMessage.originatedFromGuid === guid) {
          resolve(replyMessage);
          this.connection.off('message', onMessageTillReplied);
        }
      }

      this.connection.on('message', onMessageTillReplied);
      this.connection.sendMessage(message);
    });
  }
}