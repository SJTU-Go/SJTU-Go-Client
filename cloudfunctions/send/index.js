const cloud = require('wx-server-sdk');


exports.main = async (event, context) => {
  cloud.init();
  const db = cloud.database();
  const _ = db.command;
  
  try {
    var oldTime = (new Date().getTime() + 30 * 60 * 1000)
    var dd=new Date(oldTime)
    var Day = new Date(dd.getFullYear(), dd.getMonth(), dd.getDate(), dd.getHours(), dd.getMinutes(), dd.getSeconds(), 0)
    // 从云开数据库中查询等待发送的消息列表
    const messages = await db
      .collection('messages')
      .where({
        done: false,
        // 开始时间前半小时之内
        startTime: _.lte(Day),
      })
      .get();

      const sendPromises = messages.data.map(async message => {
        try {
          // 发送订阅消息
          await cloud.openapi.subscribeMessage.send({
            touser: message._openid,
            page: message.page,
            data: message.data,
            templateId: message.templateId,
          });
          // 发送成功后将消息的状态改为已发送
          return db
            .collection('messages')
            .doc(message._id)
            .update({
              data: {
                done: true,
              },
            });
        } catch (e) {
          return e;
        }
      });
    //return Day;
    return Promise.all(sendPromises);
  } catch (err) {
    console.log(err);
    return (err);
  }
};