'use strict';

const Controller = require('egg').Controller;

class RecordController extends Controller {
  async submitStep() {
    const ctx = this.ctx;
    const { id, key, current, data } = ctx.request.body;
    data.submitAt = Date.now();
    if (data && data.name) {
      await ctx.service.records.updateStep(parseInt(key), parseInt(current), data.name);
      const res = await ctx.service.records.submitStep(parseInt(id), parseInt(current), data);
      try {
        const url = await ctx.service.file.upload(key, data.name);
        ctx.body = { url, success: true, data: res };
      } catch (err) {
        console.log(err);
        ctx.body = { success: false, data: res, errorMessage: err.message, error: err };
      }
    } else {
      const res = await ctx.service.records.submitStep(parseInt(id), parseInt(current), data);
      ctx.body = {
        success: true,
        data: res,
      };
    }
  }
  async list() {
    const ctx = this.ctx;
    const { username } = ctx.state.user;
    const { key, ...req } = ctx.query;
    if (parseInt(key).toString() !== key) {
      ctx.body = {
        success: false,
        errorMessage: '参数格式错误',
      };
      return;
    }
    const permission = await ctx.service.homeworks.checkPermission(username, parseInt(key));
    if (permission) {
      const res = await ctx.service.records.getRecordList(parseInt(key), req);
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

  async getFileUrl() {
    const ctx = this.ctx;
    const { username } = ctx.state.user;
    const { key, id, step, filename } = ctx.query;
    if (parseInt(key).toString() !== key || parseInt(id).toString() !== id || parseInt(step).toString() !== step) {
      ctx.body = {
        success: false,
        errorMessage: '参数格式错误',
      };
      return;
    }
    const permission = await ctx.service.homeworks.checkPermission(username, parseInt(key));
    if (permission) {
      const res = await ctx.service.records.getFileUrl(parseInt(key), parseInt(id), parseInt(step), filename);
      ctx.body = {
        success: true,
        data: res,
      };
    } else {
      ctx.body = {
        success: false,
        errorMessage: '文件不存在或无权限',
      };
    }
  }

  async getLastFileUrls() {
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
      const res = await ctx.service.records.getLastFileUrls(parseInt(key));
      ctx.body = {
        success: true,
        data: res,
      };
    } else {
      ctx.body = {
        success: false,
        errorMessage: '文件不存在或无权限',
      };
    }
  }
  // async query() {
  //   const ctx = this.ctx;
  //   const { username } = ctx.state.user;
  //   const { key } = ctx.query;
  //   if (parseInt(key).toString() !== key) {
  //     ctx.body = {
  //       success: false,
  //       errorMessage: '参数格式错误',
  //     };
  //     return;
  //   }
  //   const permission = await ctx.service.homeworks.checkPermission(username, parseInt(key));
  //   if (permission) {
  //     const res = await ctx.service.homeworks.getHomework(parseInt(key));
  //     ctx.body = {
  //       success: true,
  //       data: res,
  //     };
  //   } else {
  //     ctx.body = {
  //       success: false,
  //       errorMessage: '作业不存在或无权限',
  //     };
  //   }
  // }
  // async update() {
  //   const ctx = this.ctx;
  //   const { username } = ctx.state.user;
  //   const { key, homeworkName, homeworkDesc, status, deadline, steps } = ctx.request.body;
  //   const permission = await ctx.service.homeworks.checkPermission(username, parseInt(key));
  //   if (permission) {
  //     const res = await ctx.service.homeworks.updateHomework({ key, homeworkName, homeworkDesc, steps, status, deadline });
  //     ctx.body = {
  //       success: true,
  //       data: res,
  //     };
  //   } else {
  //     ctx.body = {
  //       success: false,
  //       errorMessage: '无修改权限',
  //     };
  //   }
  // }
  // async info() {
  //   const ctx = this.ctx;
  //   const { key } = ctx.query;
  //   if (parseInt(key).toString() !== key || await ctx.service.homeworks.checkExists(parseInt(key))) {
  //     ctx.body = {
  //       success: false,
  //       errorMessage: '作业不存在',
  //     };
  //     return;
  //   }
  //   const res = await ctx.service.homeworks.homeworkInfo(parseInt(key));
  //   const id = await ctx.service.system.getNewRecordId();
  //   await ctx.service.records.addRecord({ id, key, createdAt: Date.now(), steps: [] });
  //   ctx.body = {
  //     success: true,
  //     id,
  //     data: res,
  //   };
  // }
}

module.exports = RecordController;
