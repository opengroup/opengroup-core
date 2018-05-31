import {EventEmitter} from './../base/EventEmitter.js';
import {Guid} from './../base/Guid.js';

export class Peer extends EventEmitter {
  constructor (connection) {
    super();
    this.connection = connection;
    this.modules = {};
    this.id = Guid();

    // The other side of sendMessageAndPromisifyReply.
    this.connection.on('message', (message) => {
      if (message.mustReply && message.module && this.modules[message.module] && message.method && this.modules[message.module][message.method]) {
        let result = this.modules[message.module][message.method](...message.arguments || []);

        this.connection.sendMessage({
          originatedFromGuid: message.guid,
          result: result
        })
      }
    });
  }

  /**
   * Tags a message so we can pick up the answer and return it as a promise
   */
  sendMessageAndPromisifyReply (message) {
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

  /**
   * A peer can have modules like storage or a profile etc.
   * @param {*} name 
   * @param {*} moduleToAdd 
   */
  addModule (name, moduleToAdd) {
    this.modules[name] = moduleToAdd;
  }
}
