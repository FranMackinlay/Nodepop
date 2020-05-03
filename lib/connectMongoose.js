require('dotenv').config();

const mongoose = require('mongoose');

const conn = mongoose.connection;

conn.on('open', () => {
  console.log('Conectado a MongoDB en', conn.name);
});

conn.on('error', (err) => {
  console.error('Error de conexión: ', err);
  process.exit(1);
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});


module.exports = conn;
