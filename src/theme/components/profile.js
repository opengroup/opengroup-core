import Webcam from 'jhuckaby/webcamjs';

export default function (wrapper) {
    let profile = wrapper.profileManager.getProfile();

    return {
        mounted: function () {
            Webcam.set({
                width: 320,
                height: 240,
                image_format: 'jpeg',
                jpeg_quality: 70
            });

            if (!this.model.snapshot) {
                Webcam.attach('#camera');
            }
        },

        data: function () {

            return {
                model: profile,
                schema: {
                    fields: [
                        {
                            type: "input",
                            inputType: "text",
                            model: "nickname",
                            id: "nick_name",
                            placeholder: "What is your name?",
                            required: true
                        }
                    ],
                },

                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true,
                }
            }
        },
        methods: {
            saveProfile: () => {
                if (profile.nickname && profile.snapshot) {
                    wrapper.profileManager.saveProfile(profile);
                    wrapper.router.push('/groups');
                }
            },
            snap: function () {
                if (!this.model.snapshot) {
                    Webcam.snap((newSnapshot) => {
                        this.model.snapshot = newSnapshot;
                        Webcam.reset();
                    });
                }
                else {
                    Webcam.attach('#camera');
                    Webcam.on('live', () => {
                        this.model.snapshot = false;
                        Webcam.off('live');
                    });
                }
            }
        }
    }
};