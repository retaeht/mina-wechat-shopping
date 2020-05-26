// pages/category/index.js
import { request } from "../../request/index.js"
import "../../lib/runtime/runtime.js"
//Page Object
Page({
  data: {
    // 左侧列表
    leftList: [],
    // 右侧商品内容
    rightInfo: [],
    // 左侧选中索引
    activeIndex: 0,
    // 右侧滚动条位置
    scrollTop: 0
  },
  // 分类数据
  categories: [],
  onLoad: function (options) {
    // 对数据进行缓存 存储时不用做数据转换
    // 1.先判断本地存储有没有数据
    // 2.没有发送请求
    // 3.有数据 判断数据是否过期
    const cates = wx.getStorageSync('cate');
    if (!cates) {
      this.getCategories()
    } else {
      if (Date.now() - cates.time > 1000 * 60 * 5) {
        this.getCategories()
      } else {
        this.categories = cates.data
        this.setData({
          leftList: this.categories.map(item => item.cat_name),
          rightInfo: this.categories[0].children
        })
      }
    }
  },
  // 获取商品分类数据
  async getCategories() {
    const res = await request({ url: "/categories" })
    wx.setStorageSync('cate', {
      time: Date.now(),
      data: res.data.message
    });
    this.categories = res.data.message
    this.setData({
      leftList: this.categories.map(item => item.cat_name),
      rightInfo: this.categories[0].children
    })
  },
  // 左侧菜单点击事件
  clicktHandle(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      activeIndex: index,
      rightInfo: this.categories[index].children,
      scrollTop: 0
    })
  }
});
