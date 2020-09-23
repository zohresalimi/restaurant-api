const mongoose = require("mongoose");

const dbNames = {
  production: 'sceats',
  test: 'test-sceats',
  development: 'dev-sceats'
}
const connect = () => {
  // replace with your own or MongoCloud string
  const mongoConnectionString = `mongodb://localhost/${dbNames[process.env.NODE_ENV]}`;
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  mongoose.connect(mongoConnectionString, opts);
};

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to mongo db: ', dbNames[process.env.NODE_ENV])
});

module.exports = { connect };
