const config = require('config');
const mongoose = require('mongoose');
const logger = require('./logger');

const contextLogger = logger.getContext('', {
  type: 'mongo-db',
});

const connectionUri = config.get('MongoDbConnectionString');

const db = mongoose.connection;
db.on('connected', () => contextLogger.info('Connected'));
db.once('open', () => contextLogger.info('Connection open'));
db.on('disconnected', () => contextLogger.warn('Disconnected'));
db.on('reconnected', () => contextLogger.info('Reconnected'));
db.on('error', error => contextLogger.error(`${error.stack}`));

async function retryStrategy() {
  try {
    await mongoose.connect(connectionUri, { useUnifiedTopology: true });
  } catch (e) {
    contextLogger.error(`${e.stack}`);
    setTimeout(retryStrategy, 1000);
  }
}

retryStrategy();
