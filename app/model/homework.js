'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const HomeworkSchma = new Schema({
    key: { type: Number, unique: true },
    homeworkName: { type: String, default: null },
    homeworkDesc: { type: String, default: null },
    owner: { type: String, default: null },
    steps: { type: Array, default: [] },
    progress: { type: Array, default: [ 0, 0 ] },
    status: { type: String, default: '0' },
    deadline: { type: Date, default: null },
    createAt: { type: Date, default: Date.now },
  });
  return mongoose.model('Homework', HomeworkSchma);
};
