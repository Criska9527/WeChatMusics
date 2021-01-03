// components/progress-bar/progress-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
//背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
let currentSec = -1 // 当前的秒数
let duration = 0 // 当前歌曲的总时长，以秒为单位
let isMoving = false // 表示当前进度条是否在拖拽，解决：当进度条拖动时候和updatetime事件有冲突的问题
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame: Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00',
      TotalTime: '00:00',
      movableDis: 0,//滚动点x轴方向的偏移量
      progress: 0,
    }
  },
  //生命周期
  lifetimes: {
    //在组件在视图层布局完成后执行
    ready() {
      //此时为同一首歌
      if (this.properties.isSame && this.data.showTime.TotalTime == '00:00') {
        this._setTime()
      }
      this._getMovableDis()
      this._bindBGMEvent()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      // console.log(event)
      if (event.detail.source == 'touch') {
        this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth) * 100
        this.data.movableDis = event.detail.x
        isMoving = true
      }

      // isMoving = true
    },
    onTouchEnd() {
      // 松开
      const currentTimeFmt = this._dateFormat(Math.floor(backgroundAudioManager.currentTime))
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTime.currentTime']: currentTimeFmt.min + ':' + currentTimeFmt.sec
      })
      //音乐进度设置到某一时间，s
      backgroundAudioManager.seek(duration * this.data.progress / 100)
      isMoving = false

    },
    //获取元素的宽度
    _getMovableDis() {
      //实例化对象，相当于html的dom查询语句
      const query = this.createSelectorQuery()
      //获取元素的宽高信息
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      //执行所有的query.select请求,输出代码书写顺序元素的宽高信息
      query.exec((rect) => {
        // console.log(rect)
        //赋值
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
        // console.log(movableAreaWidth, movableViewWidth)
      })

    },
    //绑定背景播放事件
    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        console.log('onPlay')
        isMoving = false
      })
      backgroundAudioManager.onStop(() => {
        console.log('onStop')
      })
      backgroundAudioManager.onPause(() => {
        console.log('onPause')
      })
      backgroundAudioManager.onPlay(() => {
        console.log('onPlay')
      })
      //监听音频正在加载中
      backgroundAudioManager.onWaiting(() => {
        console.log('onWaiting')
      })
      //监听背景音乐可以播放
      backgroundAudioManager.onCanplay(() => {
        //获取总时长
        // console.log(backgroundAudioManager.duration)
        // console.log('onCanplay')
        //判断是不是undefiend
        if (!backgroundAudioManager.duration === undefined) {
          this._setTime()
        } else {
          setTimeout(() => {
            this._setTime()
          }, 1000)
        }
      })
      //监听播放进度
      backgroundAudioManager.onTimeUpdate(() => {
        if (!isMoving) {
          let currentTime = backgroundAudioManager.currentTime  //当前播放进度时间
          console.log('updatetime的时间', currentTime)
          duration = backgroundAudioManager.duration //总时长
          const sec = currentTime.toString().split('.')[0]

          //判断当前时间与总时间是否相等
          if (sec != currentSec) {
            //格式化当前时间
            const currentTimeFmt = this._dateFormat(currentTime)
            this.setData({
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              progress: currentTime / duration * 100,//进度条
              ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`,
            })
            console.log('onTimeUpdate')
            //赋值当前的秒数
            currentSec = sec
            // console.log(currentSec)
            // // 联动歌词
            this.triggerEvent('timeUpdate', {
              currentTime
            })
          }
        }
      })
      //监听播放结束事件
      backgroundAudioManager.onEnded(() => {
        console.log('onEnded')
        //父子组件传值,参考vue的通过事件传值
        this.triggerEvent('musicEnd')
      })
      //监听error
      backgroundAudioManager.onError(() => {
        console.log('onError')
      })

    },
    //设置时长
    _setTime() {
      duration = backgroundAudioManager.duration
      // console.log(duration)
      //格式化时间
      const durationFmt = this._dateFormat(duration)
      // console.log(durationFmt)
      //给时间赋值
      this.setData({
        ['showTime.TotalTime']: `${durationFmt.min}:${durationFmt.sec}`
      })
    },
    //格式化时间
    _dateFormat(sec) {
      //分
      const min = Math.floor(sec / 60)
      //秒
      sec = Math.floor(sec % 60)
      return {
        'min': this._parse0(min),
        'sec': this._parse0(sec)
      }
    },
    //给时间补0
    _parse0(sec) {
      return sec < 10 ? '0' + sec : sec
    }
  },

})
