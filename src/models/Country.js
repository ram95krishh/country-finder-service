const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CountrySchema = new Schema({
  name: {
    required: true,
    type: Schema.Types.String,
    unique: true,
  },
  geo: {
    type: [Schema.Types.String],
    enum: ['Point'],
    coordinates: {
      type: [],
      required: true
    }
  }
});

const Country = mongoose.model('Country', CountrySchema);

module.exports = Country;
