import EventEmitter from 'events';

class ProfileManager extends EventEmitter {

    constructor (wrapper) {
        super();
        this.wrapper = wrapper;

        this.wrapper.on('ready', () => {
            if (!sessionStorage.getItem('opengroup-avatar')) {
                this.wrapper.router.push('/profile');
            }
        });
    }

}

export default ProfileManager;