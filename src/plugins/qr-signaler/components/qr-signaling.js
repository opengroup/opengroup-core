import uuid from 'uuid/v4';

export default function (wrapper) {
    let currentGroup = wrapper.groupManager.getCurrentGroup();
    let plugin = currentGroup.plugins['webrtc'];

    return {
        props: ['plugin'],
        methods: {
            createOffer () {
                currentGroup.addPeer({
                    connectionType: 'og-webrtc',
                    signalerType: 'manual',
                    uuid: uuid(),
                    signalerInfo: {
                        role: 'initiator',
                        offerCreated: (offer, returnAnswerCallback) => {
                            this.offer = JSON.stringify(offer.toJSON());
                            this.returnAnswerCallback = returnAnswerCallback;
                        },
                    }
                });
            },
            createAnswer () {
                this.currentStep = 3;
                let offer = JSON.parse(atob(this.offer));

                currentGroup.addPeer({
                    connectionType: 'og-webrtc',
                    uuid: uuid(),
                    signalerType: 'manual',
                    signalerInfo: {
                        role: 'answerer',
                        offer: offer,
                        answerCreated: (answer) => {
                            this.answer = JSON.stringify(answer.toJSON());
                        }
                    }
                });

            },
            acceptAnswer () {
                let answer = JSON.parse(this.answer);
                this.returnAnswerCallback(answer);
            },
            setOfferSend () {
                this.currentStep = 3;
            },
            setFlow(type) {
                this.flow = type;

                if (type === 'invite') {
                    this.createOffer();
                }

                this.currentStep = 2;
            }
        },
        data: function () {
            return {
                returnAnswerCallback: false,
                offer: '',
                answer: '',
                flow: '',
                currentStep: 1
            }
        }
    }
};