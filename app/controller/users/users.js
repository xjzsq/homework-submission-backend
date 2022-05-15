'use strict';

const Controller = require('egg').Controller;

class UsersController extends Controller {
  async addInviteCode() {
    const ctx = this.ctx;
    const isAdmin = await ctx.service.users.isAdmin(ctx.state.user.username);
    if (isAdmin) {
      const { code, restCount = 1 } = ctx.request.body;
      const res = await ctx.service.users.addCode(code, restCount);
      ctx.body = {
        success: true,
        data: res,
      };
    } else {
      ctx.body = {
        success: false,
        errorMessage: '权限不足',
      };
    }
  }
}

module.exports = UsersController;
