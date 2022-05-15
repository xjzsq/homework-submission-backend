'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {
  async account() {
    const ctx = this.ctx;
    const app = this.app;
    const { password, token, username, type, autoLogin } = ctx.request.body;
    console.log(username, password, type, token, autoLogin);
    if (type === 'auth') {
      if (await ctx.service.users.checkToken(username, token)) {
        const jwt = app.jwt.sign({ username }, app.config.jwt.secret);
        ctx.body = {
          success: true,
          data: {
            status: 'ok',
            type,
            currentAuthority: 'admin',
            jwt,
          },
        };
      } else {
        ctx.body = {
          success: true,
          data: {
            status: 'error',
            type,
            currentAuthority: 'guest',
          },
        };
      }
    } else if (type === 'password') {
      if (await ctx.service.users.checkPassword(username, password)) {
        const jwt = app.jwt.sign({ username }, app.config.jwt.secret);
        ctx.body = {
          success: true,
          data: {
            status: 'ok',
            type,
            currentAuthority: 'admin',
            jwt,
          },
        };
      } else {
        ctx.body = {
          success: true,
          data: {
            status: 'error',
            type,
            currentAuthority: 'guest',
          },
        };
      }
    }
  }
}

module.exports = LoginController;
