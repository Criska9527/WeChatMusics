// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })
  app.use(async (ctx, next) => {
    console.log('进入全局中间件')
    ctx.data = {}
    ctx.data.openId = event.userInfo.openId
    await next()
  })
  app.router('music', async (ctx, next) => {
    console.log('进入音乐中间件')
    ctx.data.musicName = '數鴨子'
    await next()
  }, async (ctx, next) => {
    ctx.data.musicType = '儿歌'
    ctx.body = {
      data: ctx.data
    }
  })
  app.router('movie', async (ctx, next) => {
    console.log('进入电影中间件')
    ctx.data.musicName = '千与千寻'
    await next()
  }, async (ctx, next) => {
    ctx.data.musicType = '日本动画片'
    ctx.body = {
      data: ctx.data
    }
  })
  return app.serve()
}