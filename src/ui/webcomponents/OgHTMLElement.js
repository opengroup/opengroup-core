export class OgHTMLElement extends HTMLElement {
  constructor() {
    super();
  }

  get group() {
    let parentNode = this.parentNode;
    while (parentNode.nodeName !== 'OG-UI-GROUP') parentNode = parentNode.parentNode;
    return parentNode.group;
  }

  setTemplate(template) {
    this.innerHTML = template;

    // Bind the click events of the class to the template.
    Array.from(this.querySelectorAll('[click]')).forEach((element) => {
      element.addEventListener('click', () => {
        let evalClosure = function() {
          return eval(element.getAttribute('click'));
        }.call(this);
      });
    });

    // Data binding from the template to the class.
    Array.from(this.querySelectorAll('[bind]')).forEach((element) => {
      let updateValueInContext = () => this.newMessage = element.value;
      element.addEventListener('change', updateValueInContext);
      element.addEventListener('keyup', updateValueInContext);
    });


  }
}