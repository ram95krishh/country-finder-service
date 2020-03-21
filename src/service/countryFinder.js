const router = require('express').Router();
const { getDistance } = require('geolib');

const { Country } = require('../models');
const { logger } = require('../lib');
const { countries } = require('../../countries_metadata.json');
const utils = require('./utils/countryUtils');

const onboard = async (req, res) => {
  try {
    logger.info('Onboarding countries data to DB...');
    const existingCountries = await Country.find().lean();
    const existingCountryNames = existingCountries.map(country => country.name);
    let newCountries = countries.filter(country => !existingCountryNames.includes(country.name));
    newCountries = utils.shapeCountriesData(newCountries)
    if (newCountries.length) {
      await Country.collection.insertMany(newCountries)
      return res.status(200).json(newCountries);
    }
    return res.status(200).send();
  } catch (e) {
    logger.error('Error in Onboarding countries data to DB');
    logger.error(JSON.stringify(e.stack));
    res.status(500).send(e.message);
  }
}

const getCountriesByProximity = async (req, res) => {
  try {
    logger.info('Retrieving countries by proximity...');
    const { coordinates, searchTerm } = req.body;
    const start = {
      latitude: coordinates[1],
      longitude: coordinates[0]
    };
    
    let countries = await Country.find({ name: { '$regex': '.*' + searchTerm + '.*', '$options': 'i' }}, { _id: 0 }).lean();
    countries = countries.map(country => ({
      ...country,
      distance: getDistance({ latitude: coordinates[1], longitude: coordinates[0] },
        { latitude: country.geo[1], longitude: country.geo[0] })
    }));
    countries = countries.sort((a,b) => a.distance - b.distance);
    res.status(200).json(countries);
  } catch (e) {
    logger.error('Error in retrieving countries by proximity');
    logger.error(JSON.stringify(e.stack));
    res.status(500).send(e.message);
  }
}

router.get('/onboard', onboard);
router.post('/getbyproximity', getCountriesByProximity);

module.exports = router;
