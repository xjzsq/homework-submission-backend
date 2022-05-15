'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // users 用户信息相关
  // router.get('/api/users', controller.users.users.list);
  router.get('/currentUser', app.jwt, controller.users.currentUser.info); // 获取当前登录用户信息
  router.post('/register/checkUsername', controller.users.register.checkUsername); // 检查用户名是否可用
  router.post('/register/password', controller.users.register.password); // 密码注册用户
  router.post('/register/auth', controller.users.register.auth); // 验证器注册用户
  router.post('/register/checkToken', controller.users.register.checkToken); // 测试验证器
  router.post('/login/account', controller.users.login.account); // 账号密码登录
  router.post('/users/addInviteCode', app.jwt, controller.users.users.addInviteCode); // 添加邀请码
  // homework 作业相关 - Admin
  router.get('/homework/list', app.jwt, controller.homeworks.homework.list); // 获取学生作业列表
  router.post('/homework/add', app.jwt, controller.homeworks.homework.add); // 新建作业
  router.get('/homework/query', app.jwt, controller.homeworks.homework.query); // 请求作业数据
  router.post('/homework/update', app.jwt, controller.homeworks.homework.update); // 修改作业
  // router.post('/homework/delete', app.jwt, controller.homeworks.homework.delete); // 删除作业
  router.get('/homework/record', app.jwt, controller.homeworks.record.list); // 获取作业记录
  router.get('/homework/getfileurl', app.jwt, controller.homeworks.record.getFileUrl); // 获取单个文件的下载地址
  router.get('/homework/getlastfileurls', app.jwt, controller.homeworks.record.getLastFileUrls); // 批量获取所有最后提交的文件下载链接
  router.get('/homework/getfileurls', app.jwt, controller.homeworks.record.getLastFileUrls); // 获取多个文件的下载地址
  // homework 作业相关 - Web
  router.get('/homework/info', controller.homeworks.homework.info); // Web 端获取渲染用作业信息
  router.post('/homework/submit', controller.homeworks.record.submitStep); // 获取作业信息
  // 彩蛋
  router.get('/orz', controller.home.orz);
  router.get('/', controller.home.index);
  // router.post('/api/login/outLogin', controller.users.login.outLogin);
  // router.get('/api/login/captcha', controller.users.login.captcha);
  // homework 作业信息相关
};
