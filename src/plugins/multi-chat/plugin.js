import '/multi-chat/OgMultiChat.js';

export default class MultiChat {
  /**
   * 
   * @param {Group} group 
   * @param {Object} settings 
   */
  constructor(group, settings) {
    this.group = group;
    this.settings = settings;
    group.addModule('multi-chat', this);
  }

  menuItems() {
    return [{
      'name': 'multi-chat',
      'label': 'Chat',
      'path': '/chat',
      'template': '<og-ui-multi-chat></og-ui-multi-chat>'
    }];
  }
}