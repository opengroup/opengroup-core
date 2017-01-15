import EventEmitter from 'events';
import OpenGroup from 'OpenGroup/core/OpenGroup';
import Vue from 'vue/dist/vue.common';
import VueRouter from 'vue-router';

// Templates
import App from 'OpenGroup/theme/templates/app.html!text';
import About from 'OpenGroup/theme/templates/about.html!text';
import Group from 'OpenGroup/theme/templates/group.html!text';
import GroupList from 'OpenGroup/theme/templates/group-list.html!text';
import GroupListItem from 'OpenGroup/theme/templates/group-list-item.html!text';
import ConnectionButton from 'OpenGroup/theme/templates/connection-button.html!text';

/**
 */
class Wrapper extends EventEmitter {

    groupDefinitions = [];
    groups = [];
    groupsReadyCounter = 0;

    /**
     * @constructor
     */
    constructor () {
        super();

        this.parseGroupFromUrl();
        this.parseGroupsFromSessionStorage();
        this.saveGroupsToSessionStorage();

        this.groupDefinitions.forEach((groupDefinition) => {
            var newGroup = new OpenGroup(groupDefinition);
            this.groups.push(newGroup);
            newGroup.on('ready', () => {
                this.groupsReadyCounter++;

                // TODO one failing group breaks the application.
                if (this.groupsReadyCounter == this.groupDefinitions.length) {
                    this.renderAll();
                }
            });
        });
    }

    addGroupDefinition (newGroupDefinition) {
        var knownGroupNames = this.groupDefinitions.map((groupDefinition) => groupDefinition.name);
        if (!knownGroupNames.includes(newGroupDefinition.name)) {
            this.groupDefinitions.push(newGroupDefinition);
        }
    }

    parseGroupFromUrl () {
        var hash = decodeURIComponent(window.location.hash.substr(1));
        if (!hash) { return }

        try {
            var groupDefinition = JSON.parse(hash);
            this.addGroupDefinition(groupDefinition);
            window.location.hash = ''
        }
        catch (Exception) {}
    }

    parseGroupsFromSessionStorage () {
        var existingGroups = JSON.parse(window.sessionStorage.getItem('og-groups'));

        if (existingGroups) {
            existingGroups.forEach((groupDefinition) => {
                this.addGroupDefinition(groupDefinition);
            });
        }
    }

    saveGroupsToSessionStorage () {
        window.sessionStorage.setItem('og-groups', JSON.stringify(this.groupDefinitions));
    }


    renderAll () {
        var wrapper = this;
        Vue.use(VueRouter);

        var data = {
            groups: this.groups
        };

        var allGroupSubRoutes = [];

        this.groups.forEach((group) => {
            group.triggerInfoHook('groupSubRoutes');

            allGroupSubRoutes.push({
                path: group.slug,
                component: {
                    data: function () {
                        return {
                            group: group
                        };
                    },
                    template: Group
                },
                children: group.infoHookData['groupSubRoutes']
            });

        });

        var routerData = {
            routes: [
                {
                    path: '/groups',
                    alias: '/',
                    name: 'groups',
                    component: {
                        data: function () {
                            return data;
                        },
                        template: GroupList
                    },
                    children: allGroupSubRoutes
                },
                {
                    path: '/about',
                    component: {
                        template: About
                    }
                },
            ]
        };

        var router = new VueRouter(routerData);

        Vue.component('connection-button', {
            template: ConnectionButton,
        });

        Vue.component('group-list', {
            template: GroupList,
            props: ['groups']
        });

        Vue.component('group-list-item', {
            template: GroupListItem,
            props: ['group']
        });

        Vue.component('group', {
            template: Group,
        });

        var appTemplateGlue = new Vue({
            router: router
        }).$mount('#app');

        // console.log(appTemplateGlue)

    }
}

export default Wrapper;


