import './og-menu.js';

export let ogGroup = {
  template: `
    <div class="og-group">
      <h1 v-if="group">{{ group.label }}</h1>
      <og-menu v-if="group"></og-menu>

      <h1 v-if="notFound">Group not found</h1>
    </div>
  `,

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$getGroup(to.params.groupName)
        .then(group => vm.group = group)
        .catch(() => vm.notFound = !vm.group)
    });
  },

  beforeRouteUpdate(to, from, next) {
    this.group = null;
    this.notFound = false;

    this.$getGroup(to.params.groupName).then(group => {
      this.group = group;
    }).catch(() => {
      vm.notFound = true;
    }).finally(next);
  },

  data: function() {
    return {
      notFound: false,
      group: null
    }
  }
};