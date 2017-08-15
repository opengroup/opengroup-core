export default function (wrapper) {
    return {
        props: ['group'],
        methods: {
            getFirstMenuItemPath: function (path) {
                return wrapper.menuManager.getFirstMenuItemPath(path);
            },
            getActiveConnectionsCount: function () {
                // TODO get the statuses of the connections.
                return this.group.connections.length;
            }
        }
    }
};