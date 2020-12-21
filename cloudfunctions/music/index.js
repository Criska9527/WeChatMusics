// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const rp = require('request-promise')
const BASE_URL = 'http://musicapi.leanapp.cn'
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const app = new TcbRouter({ event })
  //获取歌单
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
  //获取歌单详情列表
  //event 是 传入的参数的类
  app.router('musiclist',async(ctx,next)=>{
    ctx.body =  await rp(BASE_URL+'/playlist/detail?id='+parseInt(event.playlistId))
    .then((res)=>{
      return JSON.parse(res)
    })
  })
  return app.serve()

}