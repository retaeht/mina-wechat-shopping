// components/UpImg/UpImg.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    upImgPath: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  methods: {
    fuck(e) {
      const {index} = e.currentTarget.dataset
      this.triggerEvent('deleteImg', {index}) 
    }
  }
})
