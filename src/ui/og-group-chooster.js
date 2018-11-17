Vue.component('og-group-chooser', {

  template: `
    <div class="og-group-chooser">
      <router-link v-for="group in groups" :key="group.name" :to="{
        name: 'group', params: { groupName: group.name }
      }">{{ group.label }}</router-link>
    </div>
  `,

  data: function() {
    return {
      groups: this.$root.groups
    }
  }
});