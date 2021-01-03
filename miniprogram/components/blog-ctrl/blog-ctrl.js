// components/blog-ctrl/blog-ctrl.js
let userInfo = {}
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
    blog:Object,
  },
  externalClasses: [
    'iconfont',
    'icon-pinglun',
    'icon-fenxiang'
  ],

  /**
   * 组件的初始数据
   */
  data: {
    loginShow: false,//当前登录组件是否显示
    modalShow: false,//当前底部弹出层是否显示
    content: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //评论
    onComment() {
      const templateId = 'c5PlprolaPOAe3u--nk25Ved5SuLIVNuazviz2gjrGE'
      wx.requestSubscribeMessage({
        tmplIds: [templateId],
        success(res) {
          console.log(res)
          //用户同意了订阅，允许订阅消息
          if (res[templateId] == 'accept') {
            wx.showToast({
              title: '订阅成功',
            })
          } else {
            wx.showToast({
              title: '订阅失败',
            })
            return
          }

        },
        fail(err) {

        }
      })
      //判断是否授权
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                //显示评论弹出层
                this.setData({
                  modalShow: true
                })
                //
              }
            })
          } else {
            this.setData({
              loginShow: true
            })
          }
        },
      })
    },
    //授权成功的函数
    onLoginsuccess(event) {
      userInfo = event.detail
      //授权框消失,评论框显示
      this.setData({
        loginShow: false,
      }, () => {

        this.setData({
          modalShow: true,
        })
      })
    },
    //授权失败的函数
    onLoginfail() {
      wx.showModal({
        title: '授权用户才可以评价',
      })
    },
    onInput(event) {
      this.setData({
        content: event.detail.value
      })
    },
    //发送评论
    onSend() {

      //插入数据库
      let content = this.data.content
      if (content.trim() == '') {
        wx.showModal({
          title: '评论内容不能为空',
        })
        return
      }
      wx.showLoading({
        title: '评价中......',
        mask: true,
      })
      //获取集合，在小程序端操作数据库，后续在云函数端操作,插入数据库
      db.collection('blog-comment').add({
        data: {
          content,
          createTime: db.serverDate(),
          blogId: this.properties.blogId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,

        }
      }).then((res) => {
        //获取下发权限
        console.log(userInfo.nickName)
        // //推送订阅信息
        wx.cloud.callFunction({
          name: 'sendMessage',
          data: {
            content,
            nickName: userInfo.nickName,
            blogId: this.properties.blogId
          }
        }).then((res) => {
          console.log(res)
        })


        wx.hideLoading()
        wx.showToast({
          title: '评论成功',
        })
        this.setData({
          modalShow: false,
          content: '',
        })
        //父元素刷新評論
        this.triggerEvent('refresnCommentList')
      })




    }

  }
})
