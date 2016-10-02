import template from './chat.html!text';
import {RouteConfig, Component, View, Inject} from '../../ng-decorators.js';

@RouteConfig('chat', {
  url: '/chat',
  template: '<chat></chat>'
})
@Component({
  selector: 'chat'
})
@View({
  template: template
})
@Inject()

class Chat {
  constructor() {

  }
}

export default Chat;