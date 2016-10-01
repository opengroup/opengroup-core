import Events from '../../base/Events';

/**
 * OgEasyWebRtcSignalerTest is a webrtc signaler.
 */
class OgEasyWebRtcSignalerTest extends Events {
  /**
   * @constructor
   */
  constructor (connection, config = {}) {
    super();
    this.connection = connection;
    this.config = {};
    Object.assign(this.config, config);

    if (this.config.events && this.config.events.length) {
      this.config.events.forEach((eventArray) => {
        this.on(eventArray[0], eventArray[1]);
      });
    }

    if (this.config.role === 'initiator') {
      this.initiate();
    } else if (this.config.role === 'answerer') {
      this.answer();
    }
  }

  initiate () {
    this.connection.getOffer((offer) => {
      this.fire('createdOffer', {
        offer: offer,
        callback: (answer) => {
          this.connection.acceptAnswer(answer);
        }
      });
    });
  }

  answer () {
    this.connection.getAnswer(this.config.offer, (answer) => {
      this.fire('createdAnswer', {
        answer: answer
      });
    });
  }
}

export default OgEasyWebRtcSignalerTest;
