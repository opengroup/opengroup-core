import {EventEmitter} from './../base/EventEmitter.js';

/**
 * EasyP2P helps setting up a WebRTC connection.
 *
 * The WebRTC flow is asymmetric.
 *
 * Initiator:
 * - Create offer, send offer, receive answer, accept answer.
 *
 * Answerer:
 * - Receive offer, create answer, send answer.
 */
export class EasyP2P extends EventEmitter {

  /**
   * @param configuration, must hold iceServers so have server to do turn and stun with.
   * @constructor
   */
  constructor (configuration = {}) {
    super();
    this.configuration = {
      role: 'initiator',
      iceServers: []
    };

    // Merge the default configuration with the given configuration.
    this.configuration = Object.assign(this.configuration, configuration);
    this.webRTCOptions = Object.assign({}, this.configuration.webRTCOptions);

    // TODO should be moved to Peer.js
    this.modules = {};

    // Initiate the p2p channel.
    this.RtcPeerConnection = new RTCPeerConnection(this.webRTCOptions);

    // Start EasyP2P in the right user role: initiator or answerer.
    if (typeof this[this.configuration.role + 'Init'] === 'function') {
      this[this.configuration.role + 'Init']();
    }
    else {
      throw 'The role is wrong and therefor EasyP2P could not initiate.';
    }
  }

  /**
   * Generates a GUID.
   * @returns {string}
   */
  guid () {
    let s4 = function () {
      return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    };

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  /**
   * Creates the initial offer.
   */
  initiatorInit () {
    // Subscribe to the ICE candidates and when all are finished call our offerReady callback.
    this.RtcPeerConnection.onicecandidate = (event) => {
      if (!event.candidate) {
        this.emit('offer-ready', this.RtcPeerConnection.localDescription.toJSON().sdp);
      }
    };

    this.dataChannel = this.RtcPeerConnection.createDataChannel('datachannel');
    this.attachDataChannel();

    this.RtcPeerConnection.createOffer()
    .then((offer) => this.RtcPeerConnection.setLocalDescription(offer))
    .catch(() => console.log('Error while creating an offer'));
  }

  /**
   * Creates the answer.
   */
  answererInit () {
    if (!this.configuration.initialOffer) { throw 'Connection failed, please let the initiator try again'; }

    // Subscribe to the ICE candidates and when all are finished call our offerReady callback.
    this.RtcPeerConnection.onicecandidate = (event) => {
      if (!event.candidate) {
        this.emit('answer-ready', this.RtcPeerConnection.localDescription.toJSON().sdp);
      }
    };

    this.RtcPeerConnection.ondatachannel = (event) => {
      this.dataChannel = event.channel;
      this.attachDataChannel();
    };

    let offer = new RTCSessionDescription({ type: 'offer', sdp: this.configuration.initialOffer });
    this.RtcPeerConnection.setRemoteDescription(offer);

    this.RtcPeerConnection.createAnswer()
    .then((answer) => this.RtcPeerConnection.setLocalDescription(answer))
    .catch(() => console.log('Error while creating an answer'));
  }

  /**
   * Accepts the answer so the connection can be set up.
   * @param sdp
   */
  acceptAnswer (sdp) {
    let answer = new RTCSessionDescription({ type: 'answer', sdp: sdp });
    this.RtcPeerConnection.setRemoteDescription(answer);
  }

  /**
   * Attach callbacks to the dataChannel, is the same for both the initiator and the answerer.
   */
  attachDataChannel () {
    this.dataChannel.onopen = () => {
      this.emit('started', ...arguments);
    };

    this.dataChannel.onmessage = (messageObject) => {
      let message = JSON.parse(messageObject.data);
      this.emit('message', message);

      // TODO the following should be abstracted away in a layer on top of the class. Maybe name it Peer.js.
      if (message.mustReply) {
        if (message.module && this.modules[message.module] && message.method && this.modules[message.module][message.method]) {
          let result = this.modules[message.module][message.method](...message.arguments);

          if (result) {
            this.sendMessage({
              originatedFromGuid: message.guid,
              result: result
            })
          }
        }
      }
    };

    this.dataChannel.onclose = () => {
      this.emit('close', ...arguments);
    };

    this.dataChannel.onerror = () => {
      this.emit('error', ...arguments);
    };
  }

  /**
   * Tags a message so we can pick up the answer and return it as a promise
   */
  sendMessageAndPromisifyReply (message) {
    let guid = this.guid();

    message.guid = guid;
    message.mustReply = true;

    return new Promise((resolve, reject) => {
      let onMessageTillReplied = replyMessage => {
        if (replyMessage.originatedFromGuid === guid) {
          resolve(replyMessage);
          this.off('message', onMessageTillReplied);      
        }
      }
  
      this.on('message', onMessageTillReplied);

      this.sendMessage(message);
    });
  }

  addModule (name, moduleToAdd) {
    this.modules[name] = moduleToAdd;
  }

  /**
   * Sends a message to the other peer.
   * @param {*} message 
   */
  sendMessage (message) {
    this.dataChannel.send(JSON.stringify(message));
  }
}
