'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UserSchma = new Schema({
    username: { type: String, unique: true },
    salt: { type: String, default: null },
    secret: { type: String, default: null },
    password: { type: String, default: null },
    authority: { type: String, default: null },
    email: { type: String },
    phone: { type: String },
    avatar: { type: String },
    createTime: { type: Date, default: Date.now },
    // 用户注册时间，默认值必须传入函数，否则会返回服务启动时间
  });
  return mongoose.model('User', UserSchma);
};
