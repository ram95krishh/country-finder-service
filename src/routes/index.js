const {
  swagger,
  countryFinder,
} = require('../service');

module.exports = (app) => {
  app.get('/health', (req, res) => res.sendStatus(200));
  app.use('/countries', countryFinder);
};
