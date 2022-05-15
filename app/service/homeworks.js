'use strict';

const Service = require('egg').Service;

class HomeworkService extends Service {
  async checkPermission(username, key) {
    const { ctx } = this;
    const res = await ctx.model.Homework.findOne({ key });
    if (res === null) return false;
    if (res.owner === username) return true;
    return ctx.service.users.checkAdmin(username);
  }
  async checkExists(key) {
    const { ctx } = this;
    const res = await ctx.model.Homework.findOne({ key }, 'key');
    return res === null;
  }
  async getHomeworkList(owner, req) {
    const { ctx } = this;
    const _sorter = JSON.parse(req.sort);
    for (const key in _sorter) {
      _sorter[key] = _sorter[key] === 'ascend' ? 1 : -1;
    }
    if (JSON.stringify(_sorter) === '{}') _sorter.key = -1;
    const filter = (await ctx.service.users.checkAdmin(owner)) ? {} : { owner };
    if (req && req.key && req.key !== '') filter.key = parseInt(req.key);
    if (req && req.homeworkName && req.homeworkName !== '') filter.homeworkName = { $regex: req.homeworkName, $options: 'i' };
    if (req && req.homeworkDesc && req.homeworkDesc !== '') filter.homeworkDesc = { $regex: req.homeworkDesc, $options: 'i' };
    await ctx.service.homeworks.updateHomeworkStatus(filter);
    if (JSON.parse(req.filter).status !== null) filter.status = { $in: JSON.parse(req.filter).status };
    const res = await ctx.model.Homework.find(filter, 'key homeworkName homeworkDesc progress status deadline').sort(_sorter);
    // const res = await ctx.model.Homework.find(filter, null, { skip: (parseInt(req.current) - 1) * parseInt(req.pageSize) }).sort({ key: -1 }).limit(parseInt(req.pageSize));
    return res;
  }
  async addHomework(data) {
    const { ctx } = this;
    const res = await ctx.model.Homework.create(data);
    return res;
  }
  async getHomework(key) {
    const { ctx } = this;
    const res = await ctx.model.Homework.findOne({ key }, 'key homeworkName homeworkDesc steps progress status deadline');
    return res;
  }
  async updateHomework(data) {
    const { ctx } = this;
    const res = await ctx.model.Homework.findOneAndUpdate({ key: data.key }, data, { new: true });
    return res;
  }
  async homeworkInfo(key) {
    const { ctx } = this;
    await ctx.service.homeworks.updateHomeworkStatus({ key });
    const res = await ctx.model.Homework.findOne({ key }, 'key homeworkName steps status deadline');
    return res;
  }
  async updateHomeworkStatus(filter) {
    const { ctx } = this;
    const _filter = { ...filter };
    _filter.status = {
      $in: [
        '0', '1', '2',
      ],
    };
    _filter.deadline = {
      $lte: Date.now(),
    };
    const res = await ctx.model.Homework.updateMany(_filter, { status: '3' });
    return res;
  }
}

module.exports = HomeworkService;
