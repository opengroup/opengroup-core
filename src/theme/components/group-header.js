export default function (wrapper) {
    return {
        data: function () {
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
        }
    }
};