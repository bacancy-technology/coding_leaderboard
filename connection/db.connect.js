const mongoose = require('mongoose');
const { envConstants } = require('../helpers/constants');

exports.connect = async () => {
  mongoose.Promise = global.Promise;
  mongoose.set('debug', envConstants.DB_DEBUG_MODE === 'true');
  try {
    if (process.env.NODE_ENV === 'test') {
      await mongoose.connect(`${envConstants.DB_DIALECT}://${envConstants.DB_HOST}:${envConstants.DB_PORT}/test_db`);
    } else if (envConstants.AUTHENTICATION === 'false') {
      await mongoose.connect(`${envConstants.DB_DIALECT}://${envConstants.DB_HOST}:${envConstants.DB_PORT}/${envConstants.DB_NAME}`);
    } else {
      await mongoose.connect(`${envConstants.DB_DIALECT}://${envConstants.DB_USER}:${envConstants.DB_PASS}@${envConstants.DB_HOST}:${envConstants.DB_PORT}/${envConstants.DB_NAME}`);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('🚀 ~ exports.connect= ~ error:', error);
    process.exit(1);
  }
};

exports.removeDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

/* exports.disconnect = async () => {
  mongoose.Promise = global.Promise;
  await mongoose.disconnect();
}; */
