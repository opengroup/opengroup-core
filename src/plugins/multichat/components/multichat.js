import Moment from 'moment';

export default function (wrapper) {
    return {
        data: function () {
            if (!this.messages) {
                this.messages = [];
            }

            let currentGroup = wrapper.groupManager.getCurrentGroup();

            currentGroup.on('og.core.multichat.message', (object, connection) => {
                let message = object.message;
                message.ownerUuid = connection.uuid;
                this.messages.push(message);
            });

            return {
                newMessage: '',
                messages: this.messages
            }
        },
        methods: {
            getProfile (uuid) {
                return wrapper.profileManager.getProfile(uuid);
            },
            displayDate: function (date) {
                return Moment(date).fromNow();
            },
            sendChat: function (event) {
                if (!event || (event.metaKey || event.ctrlKey) && event.keyCode === 13) {

                    let message = {
                        text: this.newMessage,
                        date: Moment().format(),
                    };

                    this.messages.push(message);

                    let currentGroup = wrapper.groupManager.getCurrentGroup();

                    currentGroup.sendMessage({
                        owner: 'og.core.multichat',
                        message: message
                    });

                    this.newMessage = '';
                }
            }
        },
    }
};