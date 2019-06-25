import {
  Base
} from '../../utils/base.js';
class ConfirmMember extends Base {
  userToConfirm(userId, taskId, callback) {
    var params = {
      url: '/user/user/addRecommend',
      type: 'POST',
      data: {
        user_id: userId,
        task_id: taskId
      },
      sCallback: callback
    }
    this.request(params);
  }

}

export {
  ConfirmMember
}