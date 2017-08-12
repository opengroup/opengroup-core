export default function (wrapper) {
    return {
        props: ['group'],
        methods: {
            getFirstMenuItem: (path) => {
                return wrapper.menuManager.getFirstMenuItem(path);
            }
        }
    }
};