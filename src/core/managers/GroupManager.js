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

            newGroup.on('message', (message, connection) => {
                this.emit('message', message, connection, newGroup);

                if (message.owner) {
                    this.emit(message.owner + '.message', message, connection, newGroup);
                }
            });

            newGroup.on('newConnection', (connection) => {
                this.emit('newConnection', connection, newGroup);
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
        let group = this.wrapper.routeManager.getUrlParameter('group');

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

    sendMessage(message) {
        this.groups.forEach((group) => {
            group.sendMessage(message)
        })
    }
}

export default GroupManager;