import EventEmitter from 'events';
import OpenGroup from 'OpenGroup/core/OpenGroup';
import _ from 'underscore';

class GroupManager extends EventEmitter {
    groups = [];

    constructor (wrapper) {
        super();
        this.wrapper = wrapper;

        this.wrapper.on('bootstrap', () => {
            // this.wrapper.storageManager.on('defineStores', (stores) => {
            //     if (!stores[1]) { stores[1] = {} }
            //     stores[1].groups = 'name, uuid, slug, *plugins';
            // });
        });

        this.wrapper.on('ready', () => {
            this.parseGroupFromUrl();
            this.loadGroupsFromStorage();
        });
    }

    addGroup (groupManifest) {
        if (this.validGroupManifest(groupManifest) && !this.getGroupBySlug(groupManifest.slug)) {
            let newGroup = new OpenGroup(this.wrapper, groupManifest);
            this.groups.push(newGroup);

            newGroup.once('ready', () => {
                this.emit('newGroup', newGroup);
            });

            newGroup.on('save', (definition) => {
                this.saveGroup(definition);
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

            // TODO Each load triggers a save. Not to happy with this.
            newGroup.save();

            return newGroup;
        }
    }

    saveGroup (groupDefinition) {
        let savedGroups = sessionStorage.getItem('opengroup-groups');
        savedGroups = savedGroups ? JSON.parse(savedGroups) : {};
        savedGroups[groupDefinition.uuid] = groupDefinition;
        sessionStorage.setItem('opengroup-groups', JSON.stringify(savedGroups));
    }

    loadGroupsFromStorage () {
        let savedGroups = sessionStorage.getItem('opengroup-groups');
        savedGroups = savedGroups ? JSON.parse(savedGroups) : {};
        _(savedGroups).each((savedGroup) => {
            this.addGroup(savedGroup);
        });
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
        return this.groups.filter((group) => group.slug === slug)[0] || false;
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