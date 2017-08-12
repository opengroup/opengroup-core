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
            },
        },
        data: function () {
            return dataGetter();
        },
        methods: {
            toggleMenu: () => {
                document.body.dataset.mobileMenu = document.body.dataset.mobileMenu === 'expanded' ? 'collapsed' : 'expanded';
            }
        }
    }
};