db = db.getSiblingDB(process.env.DB_NAME || 'skillly_test');

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

db.createCollection('message');
db.createCollection('room');

db.message.insertOne({ _init: true });
db.room.insertOne({ name: 'test_room', _init: true });
