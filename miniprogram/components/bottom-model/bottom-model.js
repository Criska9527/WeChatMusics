// components/bottom-model/bottom-model.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  options:{
    //访问外部的样式
    //详见小程序文档
    styleIsolation:'apply-shared',
    multipleSlots:true //多个插槽
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose(){
      this.setData({
        modalShow:false
      })
    }
  }
})
