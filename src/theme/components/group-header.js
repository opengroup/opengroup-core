export default function (wrapper) {
    let dataGetter = () => {
        let menuItems = [];

        let currentGroup = wrapper.groupManager.getCurrentGroup();
        let menuItem = wrapper.menuManager.getMenuItemByPath('/groups/' + currentGroup.slug);

        if (menuItem && menuItem.children) {
            menuItems = menuItem.children;
        }

        return {
            menu: menuItems,
            group: wrapper.groupManager.getCurrentGroup()
        }
    };

    return {
        watch: {
            '$route': function() {
                let refreshedData = dataGetter();
                this.menu = refreshedData.menu;
                this.group = refreshedData.group;
            },
        },
        data: function () {
            return dataGetter();
        }
    }
};