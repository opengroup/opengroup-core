import EventEmitter from 'events';

class ProfileManager extends EventEmitter {

    profilesOfOthers = {};

    constructor (wrapper) {
        super();
        this.wrapper = wrapper;

        this.wrapper.on('ready', () => {
            let profile = this.getProfile();

            if (!profile.snapshot || !profile.nickname) {
                this.wrapper.router.push('/profile');
            }
        });

        this.wrapper.groupManager.on('og.core.profile.message', (message, connection, group) => {
            this.profilesOfOthers[connection.uuid] = message.message.profile;
        });

        this.wrapper.groupManager.on('newConnection', (connection) => {
            let profile = this.getProfile();

            if (profile.nickname && profile.snapshot) {
                connection.sendMessage({
                    owner: 'og.core.profile',
                    message: {
                        command: 'update-profile',
                        profile: profile
                    }
                });
            }
        });
    }

    getProfile (uuid = false) {
        if (uuid) {
            if (this.profilesOfOthers[uuid]) {
                return this.profilesOfOthers[uuid];
            }
        }
        else {
            let savedProfile = sessionStorage.getItem('opengroup-profile');

            let profile = {
                nickname: '',
                snapshot: ''
            };

            if (savedProfile) {
                profile = JSON.parse(savedProfile);
            }

            return profile;
        }
    }

    saveProfile (profile) {
        sessionStorage.setItem('opengroup-profile', JSON.stringify(profile));
        this.wrapper.groupManager.sendMessage({
            owner: 'og.core.profile',
            message: {
                command: 'update-profile',
                profile: profile
            }
        });
        this.emit('savedProfile', profile);
    }
}

export default ProfileManager;