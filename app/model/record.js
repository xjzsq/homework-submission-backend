'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const RecordSchma = new Schema({
    id: { type: Number, unique: true, required: true }, // 记录 id
    key: { type: Number, required: true }, // 作业 key
    createAt: { type: Date, default: Date.now }, // 用户打开页面的时间
    steps: { // 存储每一步提交的信息
      type: [{
        data: Object, // type 为信息收集时，data 为用户输入的信息
        name: { type: String, index: true }, // 文件名
        submitAt: { type: Date, default: Date.now },
        // 对应步骤的提交时间，默认值必须传入函数，否则会返回服务启动时间
      }],
      default: [],
    },
  });
  return mongoose.model('Record', RecordSchma);
};
