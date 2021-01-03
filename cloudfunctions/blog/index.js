// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const TcbRouter = require('tcb-router')
const db = cloud.database()
const blogCollection = db.collection('blog')
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  }) // 初始化TcbRouter
  app.router('list', async (ctx, next) => {
    const keyword = event.keyword
    let w = {}
    //关键字模糊查询
    if (keyword.trim() != '') {
      w = {
        //正則表達式。匹配content字段
        content: db.RegExp({
          regexp: keyword,
          options: 'i'
        })
      }
    }

    // where查询条件 skip 从第几条开始查，limit 查几条数据，orderBy(排序字段，排序方式) 排序，排序方式desc降序/asc升序
    let bloglist = await blogCollection.where(w).skip(event.start).limit(event.count)
      .orderBy('createTime', 'desc').get().then((res) => {
        return res.data
      })
    ctx.body = bloglist
  })

  app.router('detail', async (ctx, next) => {
    let blogId = event.blogId
    //存储博客详情信息
    //详情查询
    let detail = await blogCollection.where({
      _id: blogId
    }).get().then((res) => {
      return res.data
    })
    //评论查询
    const countResult = await blogCollection.count()
    const total = countResult.total
    let commentList = {
      data: []
    }
    if (total > 0) {
      //查询次数
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      const tasks = []
      for (let i = 0; i < batchTimes; i++) {
        let promise = db.collection('blog-comment').skip(i * MAX_LIMIT)
          .limit(MAX_LIMIT).where({
            blogId
          }).orderBy('createTime', 'desc').get()
        tasks.push(promise)
      }
      if (tasks.length > 0) {
        commentList = (await Promise.all(tasks)).reduce((acc, cur) => {
          return {
            data: acc.data.concat(cur.data)
          }
        })
      }

    }
    ctx.body = {
      commentList,
      detail
    }

  })

//获取用户的bloglist
  app.router('getListByOpenid', async (ctx, next) => {
    const wxContext = cloud.getWXContext()
    ctx.body = await blogCollection.where({
      _openid: wxContext.OPENID
    }).skip(event.start).limit(event.count).
      orderBy('createTime', 'desc').get().then((res) => {
        return res.data
    })
  })
  return app.serve()
}