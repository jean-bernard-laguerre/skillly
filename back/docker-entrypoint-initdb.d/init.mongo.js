db = db.getSiblingDB(process.env.DB_NAME || 'skillly');

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

db.room.InsertOne({
  name: 'test_room',  
});
