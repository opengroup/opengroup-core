import EventEmitter from 'events';
import OpenGroup from 'OpenGroup/core/OpenGroup';

class GroupManager extends EventEmitter {
    groups = [];

    constructor (wrapper) {
        super();
        this.wrapper = wrapper;

        this.wrapper.on('ready', () => {
            this.parseGroupFromUrl();
        })
    }

    addGroup (groupManifest) {
        if (this.validGroupManifest(groupManifest)) {
            let newGroup = new OpenGroup(this.wrapper, groupManifest);
            this.groups.push(newGroup);

            newGroup.once('ready', () => {
                this.emit('newGroup', newGroup);
            });

            return newGroup;
        }
        else {
            throw 'The group manifest is invalid';
        }
    }

    // TODO make group manifest validation.
    validGroupManifest (groupManifest) {
        return groupManifest && typeof groupManifest === 'object';
    }

    parseGroupFromUrl () {
        let group = this.getUrlParameter('group');

        if (group) {
            try {
                let groupManifest = JSON.parse(group);
                this.addGroup(groupManifest);
            }
            catch (Exception) {
                console.log(Exception)
            }
        }
    }

    getUrlParameter (name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        let results = regex.exec('?' + location.hash.split('?')[1]);

        if (!results) {
            results = regex.exec('?' + location.search);
        }

        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    getGroups () {
        return this.groups;
    }

    getGroupBySlug (slug) {
        return this.groups.filter((group) => group.slug === slug)[0];
    }

    getCurrentGroup () {
        let slug = this.wrapper.vueRoot.$route.params.slug;
        return this.getGroupBySlug(slug);
    }
}

export default GroupManager;