// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id:0,
        name: '商品收藏',
        isActive: true
      },
      {
        id:1,
        name: '品牌收藏',
        isActive: false
      },
      {
        id:2,
        name: '店铺收藏',
        isActive: false
      },
      {
        id:3,
        name: '浏览历史',
        isActive: false
      }
    ],
    colGoodsList: []
  },

  onShow() {
    const collect = wx.getStorageSync("collect") || [];
    this.setData({
      colGoodsList: collect
    })
      
  },
  handlechangeActive(e) {
    const {index} = e.detail
    console.log(index)
    let tabs = this.data.tabs
    tabs.forEach(i => {
      if(i.id === index) {
        i.isActive = true
      }else {
        i.isActive = false
      }
    })
    this.setData({
      tabs
    })
  }
})