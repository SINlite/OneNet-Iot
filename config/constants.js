module.exports = {
  PRODUCT_ID: 'W4b66Qt625',
  DEVICE_NAME: 'device01',
  ACCESS_KEY: 'mI7aw+joR7tfFFNdaYdOH9BZ36OS6c2sUS9fNovegRIYBNF+uL81yF890U25ShFturnAL/NmaxX4QUhtgJY70w==',
  USER_ID: '389678',
  MONGO_URI: 'mongodb://mgadmin:mgadmin@mongo:27017/attribute?authSource=admin',
  PREDICTION_SERVICE_URL: process.env.PREDICTION_SERVICE_URL || 'http://yield_predictor:5000',
  SYNC_CONFIG: {
	INTERVAL_MINUTES: 30
  }
};
