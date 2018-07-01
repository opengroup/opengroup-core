import { OgHTMLElement } from '/OgHTMLElement.js';

let template = `

  <h3>Welcome to the chat</h3>
  <textarea bind="newMessage"></textarea>
  <div><button click="this.sendMessage(this.newMessage)">Send message</button></div>

`;

customElements.define('og-ui-multi-chat', class OgMultiChat extends OgHTMLElement {

  constructor() {
    super();
    this.setTemplate(template);
  }

  attributeChangedCallback(name, oldValue, newValue) {}

  sendMessage() {
    alert(this.newMessage)
  }

});