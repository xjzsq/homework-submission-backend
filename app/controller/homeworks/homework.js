'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

const defaultProgress = [];
defaultProgress.push(0);
defaultProgress.push(0);

class HomeworkController extends Controller {
  async list() {
    const ctx = this.ctx;
    const { username } = ctx.state.user;
    const req = ctx.query;
    const res = await ctx.service.homeworks.getHomeworkList(username, req);
    ctx.body = {
      success: true,
      data: res,
    };
  }
  async add() {
    const ctx = this.ctx;
    const { username } = ctx.state.user;
    const { homeworkName, homeworkDesc, status, deadline, steps } = ctx.request.body;
    const key = await ctx.service.system.getNewHomeworkKey();
    const res = await ctx.service.homeworks.addHomework({ key, homeworkName, homeworkDesc, owner: username, steps, status, progress: defaultProgress, deadline });
    ctx.body = {
      success: true,
      data: { key: res.key },
    };
  }
  async query() {
    const ctx = this.ctx;
    const { username } = ctx.state.user;
    const { key } = ctx.query;
    if (parseInt(key).toString() !== key) {
      ctx.body = {
        success: false,
        errorMessage: '参数格式错误',
      };
      return;
    }
    const permission = await ctx.service.homeworks.checkPermission(username, parseInt(key));
    if (permission) {
      const res = await ctx.service.homeworks.getHomework(parseInt(key));
      ctx.body = {
        success: true,
        data: res,
      };
    } else {
      ctx.body = {
        success: false,
        errorMessage: '作业不存在或无权限',
      };
    }
  }
  async update() {
    const ctx = this.ctx;
    const { username } = ctx.state.user;
    const { key, homeworkName, homeworkDesc, status, deadline, steps } = ctx.request.body;
    const permission = await ctx.service.homeworks.checkPermission(username, parseInt(key));
    if (permission) {
      const res = await ctx.service.homeworks.updateHomework({ key, homeworkName, homeworkDesc, steps, status, deadline });
      ctx.body = {
        success: true,
        data: res,
      };
    } else {
      ctx.body = {
        success: false,
        errorMessage: '无修改权限',
      };
    }
  }
  async info() {
    const ctx = this.ctx;
    const { key } = ctx.query;
    if (parseInt(key).toString() !== key || await ctx.service.homeworks.checkExists(parseInt(key))) {
      ctx.body = {
        success: false,
        errorMessage: '作业不存在',
      };
      return;
    }
    const res = await ctx.service.homeworks.homeworkInfo(parseInt(key));
    if (res.status === '0') {
      ctx.body = {
        success: false,
        errorCode: '作业未开始',
        errorStatus: 'info',
        errorMessage: '作业（' + res.homeworkName + '）未开始提交，请联系管理员开放提交',
      };
      return;
    }
    if (res.status === '3') {
      ctx.body = {
        success: false,
        errorCode: '作业已截止',
        errorStatus: '403',
        errorMessage: '作业（' + res.homeworkName + '）已截止提交，截止时间：' + moment(res.deadline).format('YYYY-MM-DD HH:mm:ss'),
      };
      return;
    }
    if (res.status === '4') {
      ctx.body = {
        success: false,
        errorCode: '暂停提交',
        errorStatus: 'warning',
        errorMessage: '作业（' + res.homeworkName + '）已暂停提交，请联系管理员开放提交',
      };
      return;
    }
    const id = await ctx.service.system.getNewRecordId();
    await ctx.service.records.addRecord({ id, key, steps: [] });
    ctx.body = {
      success: true,
      id,
      data: res,
    };
  }
}

module.exports = HomeworkController;
