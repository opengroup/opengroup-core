export class Profile {
  constructor(group) {
    this.group = group;
    this.name = 'profile';
    group.addModule(this);
  }
}