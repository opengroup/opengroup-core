export default function (wrapper) {
    return {
        data: function () {
            return {
                dataUri: sessionStorage.getItem('opengroup-avatar'),
            }
        }
    }
};