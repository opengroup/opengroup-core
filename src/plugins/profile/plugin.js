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

        this.pluginData = group.config.plugins['profile'];

        if (!this.pluginData.nickname) {
            this.pluginData.nickname = sessionStorage.getItem('opengroup-nickname') || '';
        }

        this.group.on('ensure-lid', () => {
            // TODO do we need this lid?
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
                        if (plugin.pluginData.nickname) {
                            sessionStorage.setItem('opengroup-nickname', plugin.pluginData.nickname);
                        }

                        if (this.dataUri) {
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

                        if (!this.dataUri) {
                            Webcam.attach('#camera');
                        }
                    },
                    data: function () {
                        let dataUri = sessionStorage.getItem('opengroup-avatar');

                        return {
                            dataUri: dataUri,

                            model: plugin.pluginData,

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
                                fieldIdPrefix: 'user-'
                            }
                        }
                    },
                    methods: {
                        snap: function () {
                            if (!this.dataUri) {
                                Webcam.snap((dataUri) => {
                                    this.dataUri = dataUri;
                                    sessionStorage.setItem('opengroup-avatar', dataUri);
                                    Webcam.reset();
                                });
                            }
                            else {
                                Webcam.attach('#camera');
                                Webcam.on('live', () => {
                                    this.dataUri = false;
                                    sessionStorage.setItem('opengroup-avatar', false);
                                    Webcam.off('live');
                                });
                            }
                        }
                    }
                }
            }
        }];
    }

}

export default Profile;
