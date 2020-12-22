// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'criska-8gpcty0y1a402d86'
})
//导入ajax请求包 request
const rp = require('request-promise')
//初始化云数据库
const db = cloud.database()
//接口，歌单
const URL = 'http://zmap.club:3000/personalized'
//const URL = 'http://zmap.club:3000/top/playlist'

const playlistCollection = db.collection('playlist')
//最大数量
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async(event, context) => {
  //云数据库数据的总条数
  const countResult = await playlistCollection.count()
  const total = countResult.total
  //分批次，比如total=220，220除以100并向上取整等于3.
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    let promise = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  let list = {
    data: []
  }
  //所有请求完成后，合并所有数据
  if (tasks.length > 0) {
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }

  //服务器端请求的数据
  const playlist = await rp(URL).then((res) => {
    return JSON.parse(res).result
  })
  //用于存储去重后的数据集合
  const newData = []
  for (let i = 0, len1 = playlist.length; i < len1; i++) {
    let flag = true
    for (let j = 0, len2 = list.data.length; j < len2; j++) {
      if (playlist[i].id === list.data[j].id) {
        flag = false
        break
      }
    }
    if (flag) {
      newData.push(playlist[i])
    }
  }
  for (let i = 0, len = newData.length; i < len; i++) {
    await playlistCollection.add({
      data: {
        ...newData[i],
        createTime: db.serverDate(),
      }
    }).then((res) => {
      console.log('插入成功')
    }).catch((err) => {
      console.error('插入失败')
    })
  }
  return newData.length
}