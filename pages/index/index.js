//Page Object
// 封装的 promise 引用的路径一定要补全
import { request } from "../../request/index.js"
Page({
  data: {
    // 轮播图数据
    swiperList: [],
    // 导航菜单数据
    catiItems: [],
    // 楼层数据
    floordata: []
  },
  //options(Object)
  onLoad: function(options) {
    this.getSwiperList()
    this.getCatiItems()
    this.getFloordata()
  },
  // 获取轮播图数据
  getSwiperList() {
    request({
      url: '/home/swiperdata'
    }).then(result => {
      let newRes = result.data.message
      console.log(newRes)
      newRes.forEach(i => {
        i.navigator_url = i.navigator_url.replace(/main/, 'index')
      })
      this.setData({
        swiperList: newRes
      })
    })
  },
  // 获取导航菜单数据
  getCatiItems() {
    request({
      url: '/home/catitems'
    }).then(result => {
      this.setData({
        catiItems: result.data.message
      })
    })
  },
  // 获取楼层数据
  getFloordata() {
    request({
      url: '/home/floordata'
    }).then(result => {
      let newRes = result.data.message
      console.log(newRes)
      newRes.forEach(i => {
        i.product_list.forEach(j => {
          j.navigator_url = j.navigator_url.replace(/\?/, '/index?')
        })
      })
      this.setData({
        floordata: newRes
      })
    })
  }
});
  