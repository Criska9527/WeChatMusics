// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const app = new TcbRouter({ event })
  app.router('playlist', async (ctx, next) => {
    //获取数据库的集合playlist,
    //设置起始，与个数，按照createTime字段进行降序排列
    ctx.body = await cloud.database().collection('playlist')
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res
      })
  })
  return app.serve()

}