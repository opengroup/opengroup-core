export default function (wrapper) {
    return {
        props: ['items'],
        data: function () {
            return {
                submenu: wrapper.menuManager.getSubMenu(this)
            }
        },
        watch: {
            '$route': function() {
                this.submenu = wrapper.menuManager.getSubMenu(this)
            },
        }
    }
};