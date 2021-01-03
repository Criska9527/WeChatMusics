// pages/playlist/playlist.js
const MAX_LIMIT = 15
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrls: [
    
    ],
    playlist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getplaylist()
    this._getbannerlist()

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
    //清空老数据
    this.setData({
      playlist: []
    })
    this._getplaylist()
    this._getbannerlist()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getplaylist()
    this._getbannerlist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //获取歌单数据
  _getplaylist() {
    let a = []
    this.data.playlist.concat([1])
    // console.log(this.data.playlist.concat([1]))
    wx.showLoading({
      title: '加载中',
    })
    //请求云函数music
    wx.cloud.callFunction({
      name: 'music',
      data: {
        start: this.data.playlist.length,
        count: MAX_LIMIT,
        $url: 'playlist',
      }
    }).then((res) => {
      // console.log(res)
      this.setData({
        playlist: this.data.playlist.concat(res.result.data)
      })
      //手动停止下拉刷新
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  },
    //获取轮播图
    _getbannerlist() {

      wx.showLoading({
        title: '加载中',
      })
      //请求云函数music
      wx.cloud.callFunction({
        name: 'music',
        data: {
          $url: 'banner',
        }
      }).then((res) => {
        console.log(res)
        const bannerlist = res.result.banners
        this.setData({
          swiperImgUrls: bannerlist
        })
        //手动停止下拉刷新
        wx.stopPullDownRefresh()
        wx.hideLoading()
      })
    }
})