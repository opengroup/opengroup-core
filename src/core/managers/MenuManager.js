import EventEmitter from 'events';
import _ from 'underscore';

class MenuManager extends EventEmitter {

    menuItemsFlat = {};
    menuItemsTree = [];

    constructor (wrapper) {
        super();
        this.wrapper = wrapper;
    }

    indexMenuItems () {
        let sortedRoutes = _(this.wrapper.routes).chain()
        .sortBy((menuItem) => menuItem.path.substr(1).split('/').length)
        .sortBy('weight')
        .value();

        sortedRoutes.forEach((route) => {
            this.menuItemsFlat[route.path] = {
                route: route.name,
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
            if ( menuItemPathSplit.length > 1 ) this.menuItemsFlat[parentPath].children.push(this.menuItemsFlat[route.path]);
            else this.menuItemsTree.push(this.menuItemsFlat[route.path]);
        });
    }

    getMenuItemByPath (path) {
        if (this.menuItemsFlat[path]) {
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