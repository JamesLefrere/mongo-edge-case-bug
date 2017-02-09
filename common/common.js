import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { EJSON } from 'meteor/ejson';

const TestCollection = new Mongo.Collection('test');

const TYPE_NAME = 'test:my-type';

class MyType {
  constructor(id) {
    this._id = id;
  }
  
  typeName() {
    return TYPE_NAME; 
  }

  toJSONValue() {
    return this._id;
  }
}


EJSON.addType(TYPE_NAME, function (id) {
  return new MyType(id);
});


if (Meteor.isServer) {
  Meteor.startup(() => {
    TestCollection.upsert({
      _id: 'a',
    }, {
      $setOnInsert: {
        references: [{
          createdAt: new Date(),
          reference: new MyType('b')
        }]
      },
    });
    TestCollection.upsert({
      _id: 'b',
    }, {
      $setOnInsert: {
        references: [{
          createdAt: new Date(),
          reference: new MyType('c')
        }]
      },
    });
    TestCollection.upsert({
      _id: 'c',
    }, {
      $setOnInsert: {
        references: [{
          createdAt: new Date(),
          reference: new MyType('a')
        }]
      },
    });
  });

  Meteor.publish('test', function(id) {
    return TestCollection.find({ 'references.reference.EJSON$value': id });
  });
}
