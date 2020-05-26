// pages/order/index.js
import { request } from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      { id: 0, name: '全选', isActive: false },
      { id: 1, name: '待付款', isActive: false },
      { id: 2, name: '代发货', isActive: false },
      { id: 3, name: '退货/退款', isActive: false }
    ],
    token: "",
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });
    }
  },
  onShow: function () {
    const token = wx.getStorageSync('token');
    const pages = getCurrentPages();
    this.setData({
      token
    })
    let { type } = pages[pages.length - 1].options
    type = type - 0
    this.changeTabActive(type - 1)
    this.getOrderList(type, token)
  },
  // 获取订单列表
  async getOrderList(type, token) {
    const res = await request({
      url: "/my/orders/all",
      header: {
        'Authorization': token
      },
      type: type
    })
    console.log(res.data.message)
    this.setData({
      orderList: res.data.message.orders.map(i => {
        return {...i, create_time_cn: (new Date(i.create_time * 1000).toLocaleString())}
      })
    })
    
  },
  changeTabActive(index) {
    const { tabs } = this.data
    tabs.forEach(item => {
      item.id === index ? item.isActive = true : item.isActive = false
    })
    this.setData({
      tabs
    })
  },
  // 标题点击事件，从子向父传值
  tabItemChange(e) {
    const { index } = e.detail
    this.changeTabActive(index)
    console.log(index + 1)
    this.getOrderList(index + 1, this.data.token)
  }
})