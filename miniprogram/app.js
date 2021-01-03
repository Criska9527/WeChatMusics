//app.js
App({
  //生命周期函数
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env:'criska-8gpcty0y1a402d86',
        //是否记录用户
        traceUser: true,
      })
    }
    //全局
    this.globalData = {
      playingMusicId:-1,
      openid:-1,
    }
    this.getOpenid()
  },
  setPlayMusicId(musicId){
      this.globalData.playingMusicId = musicId
  },
  getPlayMusicId(){
    return  this.globalData.playingMusicId
  },
  //获取用户的openid
  getOpenid(){
    wx.cloud.callFunction({
      name:'login'
    }).then((res)=>{
      const openid =  res.result.openid
      this.globalData.openid =openid
      //判断openid是否存在
      if(wx.getStorageSync(openid)===''){
        wx.setStorageSync(openid, [])
      }
    })
  }
})
