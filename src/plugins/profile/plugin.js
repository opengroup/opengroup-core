import Plugin from 'OpenGroup/core/Plugin';
import ProfileTemplate from './templates/profile.html!text';
import Webcam from 'jhuckaby/webcamjs';
/**
 * An OpenGroup Profile plugin.
 */
class Profile extends Plugin {

    name = 'profile';
    config = {};

    /**
     * @param group.
     * @param config.
     * @constructor
     */
    constructor (group, config = {}) {
        super();
        this.group = group;
        this.wrapper = this.group.wrapper;

        Object.assign(this.config, config);

        this.group.on('ensure-lid', () => {
            this.group.lid = 'profile-temporary';
            this.wrapper.once('ready', () => {
                this.wrapper.router.push('/profile');
            });
        })
    }

    routes () {
        let plugin = this;

        return [{
            path: '/profile',
            name: 'profile',
            components: {
                main: {
                    template: ProfileTemplate,
                    beforeRouteLeave (to, from, next) {
                        if (this.dataUri) {
                            Webcam.reset();
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

                        Webcam.attach('#camera');
                    },
                    data: function () {
                        return {
                            dataUri: false
                        }
                    },
                    methods: {
                        snap: function () {
                            if (!this.dataUri) {
                                Webcam.snap((dataUri) => {
                                    this.dataUri = dataUri;
                                    sessionStorage.setItem('opengroup-avatar', dataUri);
                                });
                            }
                            else {
                                this.dataUri = false;
                                sessionStorage.setItem('opengroup-avatar', false);
                            }
                        }
                    }
                }
            }
        }];
    }

}

export default Profile;
