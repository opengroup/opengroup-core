import EventEmitter from 'events';
import _ from 'underscore';

class MenuManager extends EventEmitter {

    constructor (wrapper) {
        super();
        this.wrapper = wrapper;
    }

    nestMenu (items) {
        let hashTable = Object.create(null);

        items = _(items).chain()
        .sortBy((item) => item.path.split('/').length)
        .sortBy('weight')
        .value();

        items.forEach(item => hashTable[item.path] = { ...item, childNodes : [] } );

        let dataTree = [];

        items.forEach( item => {
            let itemPathSplit = item.path.split('/');
            let parentPath = itemPathSplit;
            parentPath.pop();
            parentPath = parentPath.join('/');
            if ( itemPathSplit.length > 1 ) hashTable[parentPath].childNodes.push(hashTable[item.path]);
            else dataTree.push(hashTable[item.path]);
        });

        return {
            nested: dataTree,
            hashed: hashTable
        };
    }

    getSubMenu (context) {
        let submenu = [];

        context.items.forEach((item) => {
            if (item.path === context.$router.currentRoute.path.substr(0, item.path.length)) {
                submenu = item.childNodes;
            }
        });

        return submenu;
    }

}

export default MenuManager;