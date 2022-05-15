'use strict';

const Controller = require('egg').Controller;

class CurrentUserController extends Controller {
  async info() {
    const ctx = this.ctx;
    const { username } = ctx.state.user;
    const res = await ctx.service.users.getUserInfo(username);
    ctx.body = {
      success: true,
      data: res,
    };
  }
}

module.exports = CurrentUserController;
