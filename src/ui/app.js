import './vue-extentions.js';

// Self loading global components.
import './og-group-chooster.js';

// Route components
import { ogGroup } from './og-group.js';
import { ogHome } from './og-home.js';

// Helpers
import { CreateTestGroups } from './CreateTestGroups.js';

let app;

let router = new VueRouter({
  routes: [{
    path: '/',
    redirect: '/groups'
  }, {
    path: '/groups',
    name: 'groups',
    component: ogHome
  }, {
    path: '/groups/:groupName',
    name: 'group',
    component: ogGroup
  }]
});

app = new Vue({
  el: '#og-app',

  router: router,

  data: function() {
    return {
      groups: []
    }
  },

  mounted: function() {
    CreateTestGroups(6).forEach((group) => {
      this.$addGroup(group);
    });
  }
});