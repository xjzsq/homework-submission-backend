'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = `<h1>CAN U SAVE ME FROM THIS PAGE?</h1>
    <a style="display:none" href="./orz">I'm here</a>
    `;
  }
  async orz() {
    const { ctx } = this;
    ctx.body = `<h1>I'm VERY HAPPY that U can find me, but I ...</h1>
    <a style="display:none">这是一个彩蛋</a>
    `;
  }
}

module.exports = HomeController;
