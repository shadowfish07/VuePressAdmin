'use strict';
const NotExistError = require('../Error/NotExistError');
const Service = require('egg').Service;
class shellTaskService extends Service {
  /**
   * 查询指定的shellTask
   * @param id {string|number} shellTask id或taskId
   * @returns {Promise<Model<shellTask>|boolean>} 成功则返回shellTask，失败则返回false
   */
  async getShellTask({ id }) {
    try {
      const shellTask = await this.canQueryShellTask(id);
      if (!shellTask) {
        return this.ctx.response.returnFail('无权限', 403);
      }
      return shellTask;
    } catch (err) {
      if (err instanceof NotExistError) {
        return this.ctx.response.returnFail('任务不存在', 404);
      }
      throw err;
    }
  }

  /**
   * 检查当前用户是否有权限查看指定的shellTask
   *
   * 管理员或shellTask任务发起者有权限
   *
   * @param id {string|number} shellTask id或taskId
   * @returns {Promise<boolean | Model<shellTask>>} 若无权限返回false，有权限返回shellTask
   * @throws {NotExistError} shellTask不存在
   */
  async canQueryShellTask(id) {
    const shellTask = await this.app.model.ShellTask.findOne({
      where: {
        [this.app.Sequelize.Op.or]: [{ id }, { taskId: id }],
      },
    });
    if (!shellTask) throw new NotExistError('文章不存在');
    if (
      this.ctx.session.role !== 'admin' &&
      shellTask.userId !== this.ctx.userId
    ) {
      return false;
    }
    return shellTask;
  }
}

module.exports = shellTaskService;
