// components/musiclist/musiclist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId:-1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(event){
      //currentTarget和Target的区别，事件冒泡
      //Target是真正的事件源，currentTarget是绑定事件的元素
      //事件源，事件处理函数，事件对象，事件类型
      //获取标签所有的自定义data
      const ds = event.currentTarget.dataset
      //歌曲id
      const musicId = ds.musicid
      this.setData({
        playingId: musicId
      })
      //跳转到播放页
      wx.navigateTo({
        //传入id和歌曲序号
        url: `../../pages/player/player?musicId=${musicId}&index=${ds.index}`,
      })
    }
  }
})
