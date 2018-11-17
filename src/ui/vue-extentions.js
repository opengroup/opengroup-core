Vue.prototype.$getGroup = function(name) {
  let findGroup = (name) => this.$root.groups.find(group => group.name === name);
  let counter = 0;

  return new Promise((resolve, reject) => {
    let findAndRetryIfNeeded = () => {
      counter++;
      let foundResult = findGroup(name);

      if (foundResult) {
        resolve(foundResult);
      } else if (counter > 5) {
        reject('Group not found');
      } else {
        setTimeout(findAndRetryIfNeeded, 200);
      }
    };

    findAndRetryIfNeeded();
  });
}

Vue.prototype.$addGroup = function(group) {
  group.on('module-add', (name, module) => {
    if (!this.$router.$routedOgModules) this.$router.$routedOgModules = {};
    if (!this.$router.$routedOgModules[name]) {
      this.$router.$routedOgModules[name] = true;

      if (typeof module.routes === 'function') {
        let routes = module.routes();
        if (routes instanceof Array) {
          routes.forEach((route) => {
            route.meta = Object.assign(route.meta || {}, { $ogModule: module });
            this.$router.addRoutes([route]);
          });
        }
      }
    }
  });

  group.on('loaded', () => {
    this.$root.groups.push(group);
  });
}