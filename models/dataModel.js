const mongoose = require('mongoose');
//const validator = require("validator");
const dataSchema = new mongoose.Schema(
  {
    name: { type: String }, 
  },
  {
    timestamps: true,
  }
);

const dataModel = mongoose.model('Data', dataSchema);
module.exports = dataModel;
