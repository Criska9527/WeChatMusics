// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表,外界接收传递
   */
  properties: {
    playlist: {
      type: Object
    }
  },
  /**
   * 相当于vue的watch？
   */
  observers: {
    //监听对象单一属性的写法
    ['playlist.playCount'](count) {
      this.setData({
        _count: this._tranNumber(count, 2)
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _count: 0
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      // this.getMusicInfo()
      this.getMovieInfo()
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //处理播放数量显示
    _tranNumber(num, point) {
      let numStr = num.toString().split('.')[0];
      if (numStr.length < 6) {
        return numStr
      } else if (numStr.length >= 6 && numStr.length <= 8) {
        //获取千位和百位
        let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point);
        // console.log(decimal)
        return parseFloat(parseInt(num / 10000) + '.' + decimal) + '万';
      } else if (numStr.length > 8) {
        //获取千万位和百万位
        let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point);
        // console.log(decimal)
        return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿';
      }
    },
    getMusicInfo(){
      wx.cloud.callFunction({
        name:"tcbRouter",
        data:{
          $url:'music'
        }
      }).then((res)=>{
        console.log(res)
      })
    },
    getMovieInfo(){
      wx.cloud.callFunction({
        name:"tcbRouter",
        data:{
          $url:'movie'
        }
      }).then((res)=>{
        console.log(res)
      })
    }
  }
})
