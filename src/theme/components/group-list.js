export default function (wrapper) {
    return {
        data: function () {
            return {
                groups: wrapper.groupManager.getGroups()
            }
        }

    }
};