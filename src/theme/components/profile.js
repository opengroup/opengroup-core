import Webcam from 'jhuckaby/webcamjs';

export default function (wrapper) {
    return {
        beforeRouteLeave (to, from, next) {
            if (this.model.dataUri) {
                next();
            }
            else {
                next(false);
            }
        },
        mounted: function () {
            Webcam.set({
                width: 320,
                height: 240,
                image_format: 'jpeg',
                jpeg_quality: 90
            });

            if (!this.model.dataUri) {
                Webcam.attach('#camera');
            }
        },

        data: function () {
            return {
                model: {
                    dataUri: sessionStorage.getItem('opengroup-avatar') || '',
                    nickname: sessionStorage.getItem('opengroup-nickname') || '',
                },

                schema: {
                    fields: [
                        {
                            type: "input",
                            inputType: "text",
                            label: "Nickname",
                            model: "nickname",
                            id: "nick_name",
                            placeholder: "Your nickname",
                            required: true
                        },
                    ],
                },

                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true,
                }
            }
        },
        methods: {
            snap: function () {
                if (!this.model.dataUri) {
                    Webcam.snap((dataUri) => {
                        this.model.dataUri = dataUri;
                        sessionStorage.setItem('opengroup-avatar', this.model.dataUri);
                        Webcam.reset();
                    });
                }
                else {
                    Webcam.attach('#camera');
                    Webcam.on('live', () => {
                        this.model.dataUri = false;
                        sessionStorage.setItem('opengroup-avatar', false);
                        Webcam.off('live');
                    });
                }
            }
        }
    }
};