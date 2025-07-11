db = db.getSiblingDB("skilly_test");

db.createUser({
  user: 'test',
  pwd: 'test',
  roles: [
    {
      role: 'readWrite',
      db: db.getName(),
    },
  ],
})

db.createCollection('room');
db.createCollection('message');

db.room.insertOne({ name: 'test_room', _init: true });
db.message.insertOne({ _init: true });
