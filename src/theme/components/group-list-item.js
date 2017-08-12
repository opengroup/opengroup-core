export default function (wrapper) {
    return {
        props: ['group'],
        methods: {
            getFirstMenuItemPath: (path) => {
                return wrapper.menuManager.getFirstMenuItemPath(path);
            }
        }
    }
};