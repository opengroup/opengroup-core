export default function (wrapper) {
    return {
        data: function () {
            return {
                profile: wrapper.profileManager.getProfile()
            }
        }
    }
};