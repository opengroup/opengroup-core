import EventEmitter from 'events';
import OpenGroup from 'OpenGroup/core/OpenGroup';
import Theme from 'OpenGroup/theme/Theme';

/**
 */
class Wrapper extends EventEmitter {

    groupDefinitions = [];
    groups = [];
    theme = false;

    /**
     * @constructor
     */
    constructor () {
        super();

        this.parseGroupFromUrl();
        this.parseGroupsFromSessionStorage();
        this.saveGroupsToSessionStorage();

        this.groupDefinitions.forEach((groupDefinition) => {
            this.groups.push(new OpenGroup(groupDefinition));
        });

        this.theme = new Theme(this);
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
}

export default Wrapper;


