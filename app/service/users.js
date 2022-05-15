'use strict';

const Service = require('egg').Service;
const authenticator = require('otplib').authenticator;
const CryptoJS = require('crypto-js');

class UserService extends Service {
  async getUserInfo(username) {
    const ctx = this.ctx;
    const { email, authority } = await ctx.model.User.findOne({ username }, 'email authority');
    return {
      username,
      avatar: 'http://www.gravatar.com/avatar/' + CryptoJS.MD5(email.trim().toLowerCase()).toString() + '?d=identicon',
      email,
      notifyCount: 0,
      unreadCount: 0,
      access: '',
      authority,
    };
  }
  async checkToken(username, token) {
    const ctx = this.ctx;
    const res = await ctx.model.User.findOne({ username }, 'secret');
    console.log(res);
    const secret = res.secret;
    return authenticator.check(token, secret);
  }
  async checkPassword(username, password) {
    const ctx = this.ctx;
    const res = await ctx.model.User.findOne({ username }, 'salt password');
    if (res && res.salt && res.password) {
      const salt = res.salt;
      const passwordHash = CryptoJS.SHA256(password + salt).toString();
      return passwordHash === res.password;
    }
    return false;
  }
  async addUser(info) {
    const ctx = this.ctx;
    const salt = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    info.password = CryptoJS.SHA256(info.password + salt).toString();
    const res = await ctx.model.User.create({ ...info, salt });
    return res;
  }
  async addCode(code, count) {
    const ctx = this.ctx;
    const isExist = await ctx.model.InviteCode.findOne({ code });
    if (isExist == null) {
      return await ctx.model.InviteCode.create({ code, restCount: count });
    }
    return await ctx.model.InviteCode.updateOne({ code }, { $inc: { restCount: count } });
  }
  async useInviteCode(username, code) {
    const ctx = this.ctx;
    const isExist = await ctx.model.InviteCode.findOne({ code }, 'restCount');
    if (isExist == null || isExist.restCount <= 0) {
      return false;
    }
    await ctx.model.InviteCode.updateOne({ code }, { $inc: { restCount: -1 }, $push: { usedInfo: username } });
    return true;
  }
  async checkUsername(username) {
    const ctx = this.ctx;
    const isExist = await ctx.model.User.findOne({ username }, '_id');
    return isExist == null;
  }
  async checkAdmin(username) {
    const ctx = this.ctx;
    const res = await ctx.model.User.findOne({ username }, 'authority');
    return res && res.authority === 'admin';
  }
}

module.exports = UserService;
