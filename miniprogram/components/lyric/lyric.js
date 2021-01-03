// components/lyric/lyric.js
let lyricHeight = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow:{
      type:Boolean,
      value:false
    },
    lyric:String,
  },
  //侦听器
  observers:{
    lyric(lrc){
      // console.log(lrc)
      if(lrc == '暂无歌词'){
        this.setData({
          lrcList:[
            {
              lrc,
              time:0
            }
          ],
          nowLyricIndex:-1
        })
      }else{
        this._parseLyric(lrc)
      }
     
     
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    lrcList:[],
    nowLyricIndex:0, //当前选中的歌词
    scrollTop:0,//滚动条滚动的高度


  },
  lifetimes:{
    ready(){
      //计算歌词的高度
      //获取手机信息
      wx.getSystemInfo({
        success: (res) => {
          // console.log(res)
          //求出1rpx的大小，在小程序中所有的手机都是750rpx
          //一行歌词对应的高度
          lyricHeight =  res.screenWidth/750*64
          

        },
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    update(currentTime){
      // console.log(currentTime)
      //拿当前时间与歌词中的时间进行匹配
      let lrcList = this.data.lrcList
      //没有歌词
      if(lrcList.length==0){
        return
      }
      //判断是不是，最后一句，如果是最后一句，取消高亮，并滚动到最后一句
      if(currentTime>lrcList[lrcList.length-1].time){
        if(this.data.nowLyricIndex!=-1){
           this.setData({
             nowLyricIndex:-1,
             scrollTop:lrcList.length*lyricHeight
           })
        }
      }
      //遍历歌词
      for(let i=0;i<lrcList.length;i++){
       
        //匹配歌词，高亮选中
        if(currentTime <=lrcList[i].time){
          // console.log(currentTime,lrcList[i].time)
          this.setData({
            nowLyricIndex:i-1,
            scrollTop:(i-1)*lyricHeight
          })
          break
        }
      }
    },
    //解析歌词
    _parseLyric(sLyric){
      //把歌词每行变成一个数组
      let line = sLyric.split('\n')
      // console.log(line)
      let _lrcList =  []
      line.forEach((elem)=>{
        let time = elem.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if(time!==null){
          // console.log(time)
          //歌词
          let lrc = elem.split(time)[1]
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          // console.log(timeReg)
          //把时间转换为秒
          let time2Seconds = parseInt(timeReg[1])*60+ parseInt(timeReg[2]) + parseInt(timeReg[3])/1000
          // console.log(time2Seconds)
          _lrcList.push({
            lrc,
            time:time2Seconds,
          })
        }

      })
      this.setData({
        lrcList:_lrcList
      })
    }
  }
})
