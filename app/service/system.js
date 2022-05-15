'use strict';

const Service = require('egg').Service;

class SystemService extends Service {
  async getNewHomeworkKey() {
    const { ctx } = this;
    const res = await ctx.model.System.findOneAndUpdate({ name: 'homeworkKey' }, { $inc: { key: 1 } }, { new: true });
    if (res === null) {
      const _res = await ctx.model.System.create({ name: 'homeworkKey' });
      return _res.key;
    }
    return res.key;
  }
  async getNewRecordId() {
    const { ctx } = this;
    const res = await ctx.model.System.findOneAndUpdate({ name: 'recordId' }, { $inc: { key: 1 } }, { new: true });
    if (res === null) {
      const _res = await ctx.model.System.create({ name: 'recordId' });
      return _res.key;
    }
    return res.key;
  }
}

module.exports = SystemService;
