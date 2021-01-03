// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    OPENID
  } = cloud.getWXContext()
  const result = await cloud.openapi.subscribeMessage.send({
    touser:OPENID,
    page: `/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
    data:{
      name2:{
        value:event.nickName
      },
      thing3:{
        value:event.content
      },
    },
    templateId:'c5PlprolaPOAe3u--nk25Ved5SuLIVNuazviz2gjrGE', //订阅消息模板ID
    miniprogramState: 'developer'
  })
  console.log(result)
  return result
}