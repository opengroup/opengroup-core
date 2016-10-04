import template from './messages.html!text';
import {View, Component, Inject} from '../../ng-decorators.js';

@Component({
  selector: 'messages'
})
@View({
  template: template
})
@Inject('GroupService', '$scope')

class Messages {
  constructor(GroupService, $scope) {
    this.scope = $scope;
    this.multiChatService = GroupService.get().getService('multi-chat');
    this.peerService = GroupService.get().getService('peer');

    this.scope.$applyAsync(() => {
      this.messages = this.multiChatService.getMessages();
    });

    this.multiChatService.on('newChatMessage', () => {
      this.scope.$applyAsync(() => {
        this.messages = this.multiChatService.getMessages();
      });
    });
  }

  getPeer(guid) {
    return this.peerService.getPeerByGuid(guid);
  }
}

export default Messages;