'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const SystemSchema = new Schema({
    name: { type: String, unique: true },
    key: { type: Number, default: 1 },
  });
  return mongoose.model('System', SystemSchema);
};
