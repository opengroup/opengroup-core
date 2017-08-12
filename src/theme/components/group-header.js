export default function (wrapper) {
    let dataGetter = () => {
        let menuItems = [];
        let menuItem = false;

        let currentGroup = wrapper.groupManager.getCurrentGroup();
        if (currentGroup) {
            menuItem = wrapper.menuManager.getMenuItemByPath('/groups/' + currentGroup.slug);
        }

        if (menuItem && menuItem.children) {
            menuItems = menuItem.children;
        }

        return {
            menu: menuItems,
            group: currentGroup
        }
    };

    return {
        watch: {
            '$route': function() {
                Object.assign(this, dataGetter());
                setTimeout(() => {
                    this.showMenu = false;
                }, 300);
            },
        },
        data: function () {
            let data = { showMenu: false };
            Object.assign(data, dataGetter());
            return data;
        },
        methods: {
            toggleMenu: function () {
                this.showMenu = !this.showMenu;
            }
        }
    }
};