const shapeCountriesData = (countries) => {
  const countryObjects = [];
  countries.forEach(country => {
    countryObjects.push(transformCountryObj(country));
  })
  return countryObjects;
}

const transformCountryObj = (country) => {
  let coordinates = [0,0];
  try {
    coordinates = [parseFloat(country.lng), parseFloat(country.lat)];
  } catch (e) {
    logger.error("Failing gracefully.. " + e.message);
  }
  let countryObj = {};
  countryObj.name = country.name;
  countryObj.geo = coordinates;
  return countryObj;
}

module.exports = {
  shapeCountriesData,
}
