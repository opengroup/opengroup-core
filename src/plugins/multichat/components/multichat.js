export default function (wrapper) {
    return {
        data: function () {
            if (!this.messages) {
                this.messages = [];
            }

            return {
                newMessage: '',
                messages: this.messages
            }
        },
        methods: {
            sendChat: function (event) {
                if ((event.metaKey || event.ctrlKey) && event.keyCode === 13) {

                    this.messages.push({
                        text: this.newMessage,
                        self: true
                    });

                    let currentGroup = wrapper.groupManager.getCurrentGroup();

                    currentGroup.sendMessage({
                        owner: 'og.core.multichat',
                        message: {
                            text: this.newMessage
                        }
                    });

                    this.newMessage = '';
                }
            }
        },
    }
};