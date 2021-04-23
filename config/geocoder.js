const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'mapquest',
  httpAdapter: 'https',
  apiKey: 'UbCNDrgJbyCpS5VSFpKkW9V0ph9ulA0B',
  formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;