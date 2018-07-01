import Navigo from './router.js';
import './webcomponents/og-ui-group.js';

class App {
  constructor() {
    this.router = new Navigo(null, true);

    this.router.on('/groups/:name*', (parameters) => {
      this.getGroup(parameters.name).then((currentGroup) => {
        let path = location.hash.substr(8);
        path = path.replace('/' + parameters.name, '');
        currentGroup.activateRoute(path);
      });
    });

    this.router.resolve();
  }

  getGroup(name) {
    let ogGroups = document.querySelectorAll('og-ui-group');
    let ogGroup = Array.from(ogGroups).find(ogGroup => ogGroup.manifest.name === name);

    return new Promise((resolve) => {
      if (ogGroup.group._ready) {
        resolve(group)
      } else {
        ogGroup.group.once('loaded', () => {
          resolve(ogGroup);
        })
      }
    });
  }
}

new App();