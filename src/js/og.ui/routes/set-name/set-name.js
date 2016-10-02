import template from './set-name.html!text';
import {RouteConfig, Component, View, Inject} from '../../ng-decorators.js';

@RouteConfig('set-name', {
  url: '/set-name',
  template: '<set-name></set-name>'
})
@Component({
  selector: 'set-name'
})
@View({
  template: template
})
@Inject('$state', 'GroupService')

class SetName {
  constructor($state, GroupService) {
    this.photo = false;

    this.router = $state;
    this.peerService = GroupService.get().getService('peer');

    this.canvas = document.getElementById('set-name-canvas');
    this.context = this.canvas.getContext('2d');
    this.video = document.getElementById('set-name-video');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream) => {
        this.stream = stream;
        this.video.src = window.URL.createObjectURL(stream);
        this.video.play();
      });
    }
  }

  removePhoto () {
    this.context.clearRect(0, 0, 160, 120);
    this.photo = false;
  }

  makePhoto () {
    this.context.drawImage(this.video, 0, 0, 160, 120);
    this.photo = this.canvas.toDataURL();
  }

  saveForm () {
    this.peerService.setIdentity({
      name: this.name,
      photo: this.photo
    });

    this.track = this.stream.getVideoTracks()[0];
    this.video.pause();
    this.track.stop();
    this.router.go('chat');
  }
}

export default SetName;