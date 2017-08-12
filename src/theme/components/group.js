export default function (wrapper) {
    let currentGroup = wrapper.groupManager.getCurrentGroup();

    return {
        data: function () {
            return {
                currentGroup: currentGroup
            }
        },
        watch: {
            '$route': function() {
                this.currentGroup = wrapper.groupManager.getCurrentGroup();
            },
        },
    }
};