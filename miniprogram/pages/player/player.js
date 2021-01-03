// pages/player/player.js
//获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
let musiclist = []
//当前正在播放歌曲的index
let nowPlayingIndex = 0
//调用全局的方法或者属性
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    //播放状态
    isPlaying: false, //false 不播放 true播放
    isLyricShow: false,//表示当前歌词是否显示
    lyric: '',//歌词
    isSame: false, //表示是否为同一首歌
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    //获取本地存储的歌曲
    nowPlayingIndex = options.index
    musiclist = wx.getStorageSync('musiclist')
    this._loadMusicDetail(options.musicId)
  },
  //获取歌曲详细信息并播放，根据序号
  _loadMusicDetail(musicId) {
    //获取当前正在播放歌曲的id
    if (musicId == app.getPlayMusicId()) {
      this.setData({
        isSame: true
      })
    } else {
      this.setData({
        isSame: false
      })
    }
    //如果不是同一首歌曲
    if (!this.data.isSame) {
      //切换之前先暂停当前歌曲
      backgroundAudioManager.stop()
    }

    let music = musiclist[nowPlayingIndex]
    // console.log(music)
    //设置NavigationBarTitle
    wx.setNavigationBarTitle({
      title: music.name,
    })
    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: false
    })
    // console.log('id',musicId)
    //给全局传值
    app.setPlayMusicId(musicId)
    //loading效果
    wx.showLoading({
      title: '歌曲加载中...'
    })
    //调用云函数请求歌曲url
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl',
      }
    }).then((res) => {
      const result = res.result
      if(result.data[0].url==null){
        wx.showToast({
          title: '无权限播放',
        })
      }
      if(!this.data.isSame){
        backgroundAudioManager.src = result.data[0].url
        backgroundAudioManager.title = music.name
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        backgroundAudioManager.singer = music.ar[0].name
        backgroundAudioManager.epname = music.al.name
      }
      // console.log(res)
    
 
      // console.log(JSON.parse(res))
      this.setData({
        isPlaying: true
      })


      //加载歌词
      wx.cloud.callFunction({
        name: 'music',
        data: {
          musicId,
          $url: 'lyric',
        }
      }).then((res) => {
        // console.log(res)
        let lyric = '暂无歌词'
        const lrc = JSON.parse(res.result).lrc
        if (lrc) {
          lyric = lrc.lyric
        }
        this.setData({
          lyric
        })
      })
      wx.hideLoading()

    })

  },
  //播放控制
  tooglePlaying() {
    //正在播放
    if (this.data.isPlaying) {
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  //上一首
  onPrev() {
    nowPlayingIndex--
    //如果小于第一首，则播放最后一首
    if (nowPlayingIndex < 0) {
      nowPlayingIndex = musiclist.length - 1
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },
  //下一首
  onNext() {
    nowPlayingIndex++
    //如果到最后一首，则播放第一首
    if (nowPlayingIndex === musiclist.length) {
      nowPlayingIndex = 0
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },
  //控制歌词是否显示
  onChangeLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },
  timeUpdate(event) {
    //组件选择器,给lyric更新一个数据 调用update 传递currentTime
    // console.log(this.selectComponent('.lyric'))
    this.selectComponent('.lyric').update(event.detail.currentTime)


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})