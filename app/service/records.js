'use strict';

const Service = require('egg').Service;

const string2Regex = str => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

class RecordService extends Service {
  async addRecord(data) {
    const { ctx } = this;
    const res = await ctx.model.Record.create(data);
    return res;
  }
  async submitStep(id, current, data) {
    const { ctx } = this;
    const _set = {};
    _set[`steps.${current}`] = data;
    const res = await ctx.model.Record.findOneAndUpdate({ id }, { $set: _set }, { new: true });
    return res;
  }
  async updateStep(key, current, filename) {
    const { ctx } = this;
    const _query = { key };
    const _queryName = filename.replace(/.[^.]+$/i, '');
    _query[`steps.${current}.name`] = { $regex: new RegExp('^' + string2Regex(_queryName), 'i') };
    const res = await ctx.model.Record.findOne(_query, '_id steps');
    if (res) {
      const _oldName = res.steps[current].name.split('/');
      _oldName.splice(1, 0, 'old');
      const newName = _oldName.join('/') + '.' + Date.now() + '.hssbak';
      await ctx.model.Record.updateOne({ _id: res._id }, { $set: { [`steps.${current}.name`]: newName } });
      return await ctx.service.file.changeName(key, res.steps[current].name, newName);
    }
    return res;
  }
  async getRecordList(key, req) {
    const { ctx } = this;
    console.log(req);
    const res = await ctx.model.Record.find({ key }, 'id createAt steps');
    // const _sorter = JSON.parse(req.sort);
    // for (const key in _sorter) {
    //   _sorter[key] = _sorter[key] === 'ascend' ? 1 : -1;
    // }
    // if (JSON.stringify(_sorter) === '{}') _sorter.key = -1;
    // const filter = (await ctx.service.users.checkAdmin(owner)) ? {} : { owner };
    // if (req && req.key && req.key !== '') filter.key = parseInt(req.key);
    // if (req && req.homeworkName && req.homeworkName !== '') filter.homeworkName = { $regex: req.homeworkName, $options: 'i' };
    // if (req && req.homeworkDesc && req.homeworkDesc !== '') filter.homeworkDesc = { $regex: req.homeworkDesc, $options: 'i' };
    // await ctx.service.homeworks.updateHomeworkStatus(filter);
    // if (JSON.parse(req.filter).status !== null) filter.status = { $in: JSON.parse(req.filter).status };
    // const res = await ctx.model.Homework.find(filter, 'key homeworkName homeworkDesc progress status deadline').sort(_sorter);
    // const res = await ctx.model.Homework.find(filter, null, { skip: (parseInt(req.current) - 1) * parseInt(req.pageSize) }).sort({ key: -1 }).limit(parseInt(req.pageSize));
    return res;
  }
  async getFileUrl(key, id, step, filename) {
    const { ctx } = this;
    const res = await ctx.model.Record.findOne({ id }, 'key steps');
    if (res && res.key === key && res.steps[step].name === filename) {
      return await ctx.service.file.get(key, filename);
    }
    return null;
  }

  async getLastFileUrls(key) {
    const { ctx } = this;
    const list = (await ctx.service.file.list(key)).filter(item => !item.name.endsWith('.hssbak'));
    const _res = [];
    list.map(async item => _res.push({ name: item.name.replace(new RegExp('^' + key + '/'), ''), url: await ctx.service.file.get(key, item.name.replace(new RegExp('^' + key + '/'), '')) }));
    return _res;
  }
}

module.exports = RecordService;
