import EventEmitter from 'events';

/**
 * An OpenGroup is an object that holds peers and functions as a bus.
 */
class Theme extends EventEmitter {

    /**
     * @param group.
     * @param config.
     * @constructor
     */
    constructor (group, config = {}) {
        super();
        this.config = {};
        Object.assign(this.config, config);
        this.group = group;

        this.on('preprocess', (type, variables) => {
            variables.attributes = {
                class: [type]
            }
        });
    }

    renderAll () {
        var groupMarkup = `<div class="opengroup-wrapper">
            ${this.render('connectionButtons', {
            buttons: this.group.infoHookData['connectionButtons']
        })}
        </div>`;

        var groupWrapper = document.querySelector(this.group.config.element);

        if (groupWrapper) {
            groupWrapper.innerHTML = groupMarkup;

            this.attachTemplateLinkCallbacks();
        }
    }

    rerender () {
        this.group.infoHookData['connectionButtons'][0].title = 'henk'
      this.renderAll()
    }

    attachTemplateLinkCallbacks () {
        var templateLinks = document.querySelectorAll('[data-template-callback]');
        Array.from(templateLinks).forEach((templateLink) => {
            templateLink.addEventListener('click', (event) => {
                if (templateCallbacks[templateLink.dataset.templateCallback]) {
                    templateCallbacks[templateLink.dataset.templateCallback]();
                }
                event.preventDefault();
            })
        });
    }

    render (type, variables) {
        if (typeof this[type] === 'function') {
            this.emit('preprocess', type, variables);
            this.emit('preprocess.' + type, variables);
            return this[type](variables);
        }
    }

    connectionButtons (variables) {
        return `<div class="${variables.attributes.class.join(' ')}">
            <ul class="connection-buttons-wrapper-inner">
                ${variables.buttons.map(button => `<li>${this.render('button', button)}</li>`)}
            </ul>
        </div>`;
    }

    button (variables) {
        if (variables.callback) {
            if (!window.templateCallbacks) { window.templateCallbacks = {} }
            window.templateCallbacks[variables.name] = variables.callback;
            return `<a data-template-callback="${variables.name}" href="#${variables.name}">${variables.title}</a>`;
        }
        else {
            return `<a href="${variables.url}">${variables.title}</a>`;
        }
    }
}

export default Theme;
