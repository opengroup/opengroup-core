import template from './create-message.html!text';

import {View, Component, Inject} from '../../ng-decorators.js';

@Component({
  selector: 'create-message'
})
@View({
  template: template
})
@Inject('$state', 'GroupService')

class CreateMessage {
  constructor($state, GroupService) {
    this.router = $state;
    this.group = GroupService.get();
    this.multiChatService = this.group.getService('multi-chat');
    this.peerService = this.group.getService('peer');
    this.identity = this.peerService.getIdentity();
  }

  keypress (event) {
    if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey && this.message) {

      var chatMessage = {
        text: this.message,
        timestamp: Date.now()
      };

      this.group.connectionBus.broadcast({
        identifier: 'multiChat',
        chatMessage: chatMessage
      });

      this.multiChatService.addChatMessage(chatMessage, 'self');

      this.message = '';
    }
  }
}

export default CreateMessage;