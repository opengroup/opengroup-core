import EventEmitter from 'events';
import _ from 'underscore';

class MenuManager extends EventEmitter {

    menuItemsFlat = [];

    constructor (wrapper) {
        super();
        this.wrapper = wrapper;
    }

    indexMenuItems () {
        this.wrapper.routes.forEach((route) => {
            this.menuItemsFlat.push({
                route: route.name,
                path: route.path,
                title: route.title
            })
        })

        console.table(this.menuItemsFlat)
    }

}

export default MenuManager;