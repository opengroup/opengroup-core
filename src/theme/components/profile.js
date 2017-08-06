import Webcam from 'jhuckaby/webcamjs';

export default function (wrapper) {
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
            let profile = wrapper.profileManager.getProfile();

            return {
                model: profile,
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
                        {
                            type: 'submit',
                            onSubmit: () => {
                                if (this.model.nickname && this.model.snapshot) {
                                    wrapper.profileManager.saveProfile(this.model);
                                    wrapper.router.push('/groups');
                                }
                            },
                            validateBeforeSubmit: true,
                            buttonText: 'Save profile'
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