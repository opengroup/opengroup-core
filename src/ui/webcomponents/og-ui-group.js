import './og-ui-menu.js';
import { Group } from './../../core/group/Group.js';
import { GroupManifest } from './../../core/group/GroupManifest.js';

customElements.define('og-ui-group', class UiGroup extends HTMLElement {
  constructor() {
    super();

    this.menu = document.createElement('og-ui-menu')
    this.appendChild(this.menu);
    this.settings = JSON.parse(this.getAttribute('settings'));
    this.manifest = new GroupManifest(this.settings);
    this.group = new Group(this.manifest);
    this.inner = document.createElement('div');
    this.inner.classList.add('inner');
    this.appendChild(this.inner);
  }

  connectedCallback() {
    this.childNodes.forEach((childNode) => {
      if (childNode.nodeName.substr(0, 3) === 'OG-' && childNode.initiated) {
        if (!childNode._ogInitiated) {
          childNode._ogInitiated = true;
          childNode.initiated();
        }
      }
    });
  }

  activateRoute(path) {
    let matchedMenuItem = false;
    Object.values(this.group.modules).forEach((module) => {
      matchedMenuItem = module.menuItems().find(menuItem => menuItem.path === path);
    });

    if (matchedMenuItem) {
      this.inner.innerHTML = matchedMenuItem.template;
    }
  }

});