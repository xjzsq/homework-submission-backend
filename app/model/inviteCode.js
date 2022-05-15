'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const InviteCodeSchma = new Schema({
    code: { type: String },
    createTime: { type: Date, default: Date.now },
    usedInfo: { type: Array, default: [] },
    restCount: { type: Number, default: 1 },
  });
  return mongoose.model('InviteCode', InviteCodeSchma);
};
