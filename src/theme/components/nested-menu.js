export default function (wrapper) {
    return {
        mounted: function () {
            window.addEventListener('resize', () => {
               this.mobile = window.innerWidth < 961;
           });
        },
        props: ['items'],
        data: function () {
            return {
                mobile: window.innerWidth < 961,
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