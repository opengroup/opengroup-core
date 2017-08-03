import EventEmitter from 'events';
import _ from 'underscore';
import OpenGroup from 'OpenGroup/core/OpenGroup';

class GroupManager extends EventEmitter {
    groupDefinitions = [];
    groups = [];
    groupsReadyCounter = 0;

    constructor (wrapper) {
        super();
        this.wrapper = wrapper;

        this.parseGroupFromUrl();
        this.parseGroupsFromSessionStorage();

        this.groupDefinitions.forEach((groupDefinition) => {
            let newGroup = new OpenGroup(this.wrapper, groupDefinition);
            this.groups.push(newGroup);
            newGroup.on('ready', () => {
                this.groupsReadyCounter++;

                // TODO one failing group breaks the application.
                if (this.groupsReadyCounter === this.groupDefinitions.length) {
                    this.emit('ready');
                }
            });
        });
    }

    addGroupDefinition (newGroupDefinition) {
        let knownGroupNames = this.groupDefinitions.map((groupDefinition) => groupDefinition.uuid);
        if (!knownGroupNames.includes(newGroupDefinition.uuid)) {
            this.groupDefinitions.push(newGroupDefinition);
        }
    }

    parseGroupFromUrl () {
        let group = this.getUrlParameter('group');

        if (group) {
            try {
                let groupDefinition = JSON.parse(group);
                this.addGroupDefinition(groupDefinition);
            }
            catch (Exception) {
                console.log(Exception)
            }
        }
    }

    parseGroupsFromSessionStorage () {
        let existingGroups = JSON.parse(window.sessionStorage.getItem('og-groups'));

        if (existingGroups) {
            _.forEach(existingGroups, (groupDefinition) => {
                this.addGroupDefinition(groupDefinition);
            });
        }
    }

    getUrlParameter (name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        let results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    getGroups () {
        return this.groups;
    }

    getCurrentGroup () {
        if (this.wrapper.vueRoot.$route.meta.group) {
            return this.wrapper.vueRoot.$route.meta.group;
        }
    }
}

export default GroupManager;