import EventEmitter from 'events';
import _ from 'underscore';
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
        return true;
    }

    parseGroupFromUrl () {
        let group = this.getUrlParameter('group');

        if (group) {
            try {
                let groupManifest = JSON.parse(group);
                let newGroup = this.addGroup(groupManifest);
                this.wrapper.router.push('/groups/' + newGroup.slug);
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