export default function (wrapper) {
    return {
        data: function () {
            let currentGroup = wrapper.groupManager.getCurrentGroup();
            let menuItem = wrapper.menuManager.getMenuItemByPath('/groups/' + currentGroup.slug);

            return {
                menu: menuItem.children,
                group: wrapper.groupManager.getCurrentGroup()
            }
        }
    }
};