import Webcam from 'jhuckaby/webcamjs';

export default function (wrapper) {
    let hasChecked = false;

    let profile = wrapper.profileManager.getProfile();

    let data = {
        mode: 'landscape',
        model: profile,
        schema: {
            fields: [
                {
                    type: "input",
                    inputType: "text",
                    model: "nickname",
                    id: "nick_name",
                    label: "What is your name?",
                    required: true
                }
            ],
        },

        formOptions: {
            validateAfterLoad: true,
            validateAfterChanged: true,
        }
    };

    let startWebcam = () => {
        Webcam.attach('#camera');
        Webcam.on('live', () => {
            if (!hasChecked) {
                let video = document.querySelector('video');
                if (video.videoHeight > video.videoWidth) {
                    data.mode = 'portrait';

                    Webcam.set({
                        width: 240,
                        height: 320,
                        dest_width: 240,
                        dest_height: 320,
                        crop_width: 240,
                        crop_height: 240,
                        image_format: 'jpeg',
                        jpeg_quality: 90
                    });
                }
            }

            profile.snapshot = false;
            Webcam.off('live');
            hasChecked = true;
        });
    };

    return {
        mounted: function () {
            Webcam.set({
                width: 320,
                height: 240,
                dest_width: 320,
                dest_height: 240,
                crop_width: 240,
                crop_height: 240,
                image_format: 'jpeg',
                jpeg_quality: 90
            });

            if (!this.model.snapshot) {
                startWebcam();
            }
        },

        data: function () {
            return data;
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
                    startWebcam();
                }
            }
        }
    }
};