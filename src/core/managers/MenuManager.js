import EventEmitter from 'events';
import _ from 'underscore';

class MenuManager extends EventEmitter {

    menuItemsFlat = {};
    menuItemsTree = [];

    constructor (wrapper) {
        super();
        this.wrapper = wrapper;

        this.wrapper.on('preReady', () => {
            this.wrapper.groupManager.on('newGroup', (group) => {
                let groupMenuItems = group.getMenuItems();
                this.indexMenuItems(groupMenuItems);
            });
        });
    }

    indexMenuItems (routes) {
        let sortedRoutes = _(routes).chain()
        .sortBy((menuItem) => menuItem.path.substr(1).split('/').length)
        .sortBy('weight')
        .value();

        sortedRoutes.forEach((route) => {
            this.menuItemsFlat[route.path] = {
                route: route.name ? route.name : '',
                path: route.path,
                title: route.title,
                children: []
            }
        });

        sortedRoutes.forEach(route => {
            let menuItemPathSplit = route.path.split('/');
            let parentPath = menuItemPathSplit;
            parentPath.pop();
            parentPath = parentPath.join('/');

            // Fix for dynamic paths.
            if (!this.menuItemsFlat[parentPath]) {
                this.menuItemsFlat[parentPath] = {
                    children: []
                }
            }

            if ( menuItemPathSplit.length > 1 ) this.menuItemsFlat[parentPath].children.push(this.menuItemsFlat[route.path]);
            else this.menuItemsTree.push(this.menuItemsFlat[route.path]);
        });
    }

    getMenuItemByPath (path) {
        if (this.menuItemsFlat && this.menuItemsFlat[path]) {
            return this.menuItemsFlat[path];
        }
    }

    getSubMenu (context) {
        let submenu = [];

        context.items.forEach((item) => {
            if (item.path === context.$router.currentRoute.path.substr(0, item.path.length)) {
                submenu = item.children;
            }
        });

        return submenu;
    }

}

export default MenuManager;