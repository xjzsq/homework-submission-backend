'use strict';

const Controller = require('egg').Controller;
const authenticator = require('otplib').authenticator;

class RegisterController extends Controller {
  async checkUsername() {
    const ctx = this.ctx;
    const { username } = ctx.request.body;
    if (await ctx.service.users.checkUsername(username)) {
      ctx.body = {
        success: true,
        data: true,
      };
    } else {
      ctx.body = {
        success: true,
        data: false,
        errorMessage: '用户名已存在',
      };
    }
  }
  async password() {
    const ctx = this.ctx;
    const { username, email, invite, password } = ctx.request.body;
    if (await ctx.service.users.checkUsername(username)) {
      if (await ctx.service.users.useInviteCode(username, invite)) {
        await ctx.service.users.addUser({ username, email, password });
        ctx.body = {
          success: true,
          data: {
            status: 'ok',
            currentAuthority: 'admin',
          },
        };
      } else {
        ctx.body = {
          success: true,
          data: {
            status: 'error',
            currentAuthority: 'guest',
            errorCode: 'inviteCodeError',
          },
        };
      }
    } else {
      ctx.body = {
        success: false,
        data: {
          status: 'error',
          currentAuthority: 'guest',
          errorCode: 'usernameError',
        },
        errorMessage: '用户名已存在（如果你看到这条提示说明出现了 Bug）',
      };
    }
  }
  async auth() {
    const ctx = this.ctx;
    const { username, email, invite } = ctx.request.body;
    if (await ctx.service.users.checkUsername(username)) {
      if (await ctx.service.users.useInviteCode(username, invite)) {
        const secret = authenticator.generateSecret();
        const qrcode = authenticator.keyuri(username, '作业提交', secret);
        await ctx.service.users.addUser({ username, email, secret });
        ctx.body = {
          success: true,
          data: {
            qrcode,
            status: 'ok',
          },
        };
      } else {
        ctx.body = {
          success: true,
          data: {
            status: 'error',
            currentAuthority: 'guest',
            errorCode: 'inviteCodeError',
          },
        };
      }
    } else {
      ctx.body = {
        success: false,
        data: {
          status: 'error',
          currentAuthority: 'guest',
          errorCode: 'usernameError',
        },
        errorMessage: '用户名已存在（如果你看到这条提示说明出现了 Bug）',
      };
    }
  }
  async checkToken() {
    const ctx = this.ctx;
    const { username, token } = ctx.request.body;
    if (await ctx.service.users.checkToken(username, token)) {
      ctx.body = {
        success: true,
        data: true,
      };
    } else {
      ctx.body = {
        success: true,
        data: false,
      };
    }
  }
}


module.exports = RegisterController;
