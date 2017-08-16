import uuid from 'uuid/v4';

import 'LazarSoft/jsqrcode/src/grid.js';
import 'LazarSoft/jsqrcode/src/version.js';
import 'LazarSoft/jsqrcode/src/detector.js';
import 'LazarSoft/jsqrcode/src/formatinf.js';
import 'LazarSoft/jsqrcode/src/errorlevel.js';
import 'LazarSoft/jsqrcode/src/bitmat.js';
import 'LazarSoft/jsqrcode/src/datablock.js';
import 'LazarSoft/jsqrcode/src/bmparser.js';
import 'LazarSoft/jsqrcode/src/datamask.js';
import 'LazarSoft/jsqrcode/src/rsdecoder.js';
import 'LazarSoft/jsqrcode/src/gf256poly.js';
import 'LazarSoft/jsqrcode/src/gf256.js';
import 'LazarSoft/jsqrcode/src/decoder.js';
import 'LazarSoft/jsqrcode/src/qrcode.js';
import 'LazarSoft/jsqrcode/src/findpat.js';
import 'LazarSoft/jsqrcode/src/alignpat.js';
import 'LazarSoft/jsqrcode/src/databr.js';

import Webcam from 'jhuckaby/webcamjs';
import LZString from 'lz-string';

export default function (wrapper) {
    let currentGroup = wrapper.groupManager.getCurrentGroup();
    let plugin = currentGroup.plugins['webrtc'];

    return {
        mounted1: function () {
            let webcamOptions = {
                width: 480,
                height: 640,
                image_format: 'jpeg',
                jpeg_quality: 90,
            };

            if (typeof navigator.mediaDevices.enumerateDevices === 'undefined') {
                Webcam.set(webcamOptions);
                Webcam.attach('#camera');
            } else {
                navigator.mediaDevices.enumerateDevices()
                .then(function (devices) {
                    let cameras = devices.filter(function (device) {
                        return device.kind === 'videoinput';
                    });

                    let deviceId = null;

                    cameras.forEach(function (camera) {
                        // Search back camera on the device
                        if (camera.label.toLowerCase().search('back') > -1) {
                            deviceId = camera.deviceId;
                        }
                    });

                    // If we don't find the back camera we use last camera in the list
                    if (!deviceId && cameras.length) {
                        deviceId = cameras[cameras.length - 1].deviceId;
                    }

                    if (deviceId) {
                        // If we have `deviceId` of a camera we run webcam with the following params:
                        webcamOptions.constraints = {
                            deviceId: {
                                exact: deviceId
                            },
                            facingMode: 'environment'
                        }
                    }

                    Webcam.set(webcamOptions);
                    Webcam.attach('#camera');
                })
                .catch(function (error) {
                    console.log(error);
                });
            }

            Webcam.on('live', () => {
                let video = document.querySelector('video');
                let canvas = document.createElement("CANVAS");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                qrcode.callback = function (data) {
                    if (data.substr(0, 1) === '{') {
                       clearInterval(interval);
                       Webcam.reset();
                       console.log(data)
                    }
                };

                let interval = setInterval(() => {
                    canvas.getContext('2d').drawImage(video, 0, 0);
                    let dataUri = canvas.toDataURL('image/jpeg');
                    qrcode.decode(dataUri);
                }, 300);
            });
        },
        methods: {
            createOffer () {
                currentGroup.addPeer({
                    connectionType: 'og-webrtc',
                    signalerType: 'manual',
                    uuid: uuid(),
                    signalerInfo: {
                        role: 'initiator',
                        offerCreated: (offer, returnAnswerCallback) => {
                            this.offer = LZString.compress(JSON.stringify(offer.toJSON())).substr(0, 20);
                            this.returnAnswerCallback = returnAnswerCallback;
                        },
                    }
                });
            },
            createAnswer () {
                this.currentStep = 3;
                let offer = LZString.decompress(JSON.parse(this.offer));

                currentGroup.addPeer({
                    connectionType: 'og-webrtc',
                    uuid: uuid(),
                    signalerType: 'manual',
                    signalerInfo: {
                        role: 'answerer',
                        offer: offer,
                        answerCreated: (answer) => {
                            this.answer = LZString.compress(JSON.stringify(answer.toJSON()));
                        }
                    }
                });

            },
            acceptAnswer () {
                let answer = LZString.decompress(this.answer);
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