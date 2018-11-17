import { ogMultiChat } from './og-multi-chat.js';

export default class MultiChat {
  /**
   *
   * @param {Group} group
   * @param {Object} settings
   */
  constructor(group, settings) {
    this.group = group;
    this.settings = settings;
    this.name = 'multi-chat';
    group.addModule(this);
  }

  routes() {
    return [{
      'name': 'multi-chat',
      'path': '/groups/:group/chat',
      component: ogMultiChat
    }];
  }
}