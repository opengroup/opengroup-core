export default function (wrapper) {
    return {
        data: function () {
            return {
                group: wrapper.groupManager.getCurrentGroup()
            }
        }
    }
};