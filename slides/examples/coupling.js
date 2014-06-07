var rawCountries = require('./countries');
var _ = require('underscore');

function getCountries(name, island, continent) {
  var countries = rawCountries;
  if(name) {
    countries = _.filter(countries, function filterCountries(country) {
      return country.indexOf(name)>=0;
    });
  }
  return countries;
}

function searchCountriesByName(countries, name) {}

getCountries();


















