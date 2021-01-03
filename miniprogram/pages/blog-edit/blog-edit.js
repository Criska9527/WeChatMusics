// pages/blog-edit/blog-edit.js
const MAX_WORDS_NUM = 140
//最大图片的个数
const MAX_IMG_NUM = 9

const db = wx.cloud.database()
//当前输入的文字内容
let content = ''
let userInfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //输入的文字个数
    wordsNum: 0,
    footerBottom: 0,
    images: [],
    selectPhoto: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    userInfo = options
  },
  onInput(event) {
    console.log(event.detail.value)
    let wordsNum = event.detail.value.length
    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大字数为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum
    })
    content = event.detail.value
    
  },
  onFocus(event) {
    console.log(event)
    this.setData({
      footerBottom: event.detail.height,
    })
  },
  onBlur(event) {
    console.log(event)
    this.setData({
      footerBottom: 0,
    })
  },
  //选择图片
  onChoseImage() {
    //还能再选几张图片
    let max = MAX_IMG_NUM - this.data.images.length
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compress'], //图片类型
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res)
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        //还可以选几张
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({
          selectPhoto: max <= 0 ? false : true
        })
      }
    })
  },
  //删除图片
  onDelImage(event) {
    //删除图片
    this.data.images.splice(event.target.dataset.index, 1)
    event.target.dataset.index
    //删除元素
    this.setData({
      images: this.data.images
    })
    //判断数组长度，显示加号
    if (this.data.images.length == MAX_IMG_NUM - 1) {
      this.setData({
        selectPhoto: true
      })
    }
  },
  //预览当前图片
  onPreview(event) {
    wx.previewImage({
      urls: this.data.images,
      current: event.target.imgsrc
    })
  },
  send() {
    //数据 => 云数据库
    //数据库:内容,图片,openid,昵称，头像,时间
    //图片=> 云存储 fileId 云文件id
    if(content.trim()==''){
      wx.showModal({
        title: '请输入内容',
        content:'',
      })
      return
    }
    wx.showLoading({
      title:'发布中......',
      mask:true
    })
    let promiseArr = []
    let fileIds = []
    for (let i = 0; i < this.data.images.length; i++) {
      let p = new Promise((resolve, reject) => {
        let item = this.data.images[i]
        //文件扩展名
        let suffix = /\.\w+$/.exec(item)[0]
        //图片上传
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 10000000 + suffix,
          filePath: item, //临时路径
          success: (res) => {
            console.log(res)
            fileIds = fileIds.concat(res.fileID)
            resolve()
          },
          fail: (error) => {
            console.log(error)
            reject()
          }
        })
      })
      promiseArr.push(p)
    }
    //存入云数据库
    Promise.all(promiseArr).then((res)=>{
      console.log('数据库',db)
      db.collection('blog').add({
        data:{
          content,
          img:fileIds,
          createTime:db.serverDate(),
          ...userInfo,
        }
      }).then((res)=>{
          wx.showToast({
            title: '发布成功',
          })
          wx.hideLoading()
          //返回blog界面，并且刷新
          wx.navigateBack()
          //取到当前小程序的界面
          const pages = getCurrentPages()
          //取到上一个界面
          const prevPage = pages[pages.length-2]
          prevPage.onPullDownRefresh()
      }).catch((err)=>{
        wx.showToast({
          title: '发布失败',
        })
        wx.hideLoading()
      })
    })

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