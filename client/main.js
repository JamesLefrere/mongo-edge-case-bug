import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.input.onCreated(function () {
  this.id = new ReactiveVar('a');
  this.autorun(() => {
    const id = this.id.get();
    console.log(`subscribing to ${id}`)
    this.subscribe('test', id);
  });
  
});

Template.input.helpers({
  id() {
    return Template.instance().id.get();
  },
});

Template.input.events({
  'change input'({target}, instance) {
    instance.id.set(target.value);
  },
});
