export default function (wrapper) {
    return {
        data: function () {
            return {
                // Profiles are now for the whole app and not group specific.
                dataUri: sessionStorage.getItem('opengroup-avatar'),
                nickname: sessionStorage.getItem('opengroup-nickname'),
            }
        }
    }
};