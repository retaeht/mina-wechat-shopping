// pages/search/index.js
import {request} from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchList: [],
    searchAllInfo: [],
    // 取消按钮显示隐藏
    isFocus: false,
    value: ''
  },
  timeId: -1,
  handleInput(e) {
    let query = e.detail.value
    
    // 搜索防抖 ：利用定时器延时发送
    clearTimeout(this.timeId)
    this.timeId = setTimeout(()=> {
      if(query.trim().length === 0) {
        this.setData({
          searchList: [],
          isFocus: false
        })
        return 
      }
      this.setData({
        isFocus: true
      })
      this.getSearchKey(query)
    }, 1000)
  },
  async getSearchKey(query) {
    const res = await request({
      url: "/goods/search",
      query: query
    })
    console.log(res)
    this.setData({
      searchList: res.data.message.goods,
      searchAllInfo: res.data.message
    })
  },
  handleCancel() {
    this.setData({
      searchList: [],
      isFocus: false,
      value: ''
    })
  }
})