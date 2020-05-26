// pages/pay/index.js
// pages/cart/index.js
import { showToast, request } from '../../request/index'
Page({

  data: {
    address: {},
    cartData: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    let address = wx.getStorageSync('address') || [];
    let cartData = wx.getStorageSync('cart') || [];
    cartData = cartData.filter(i => i.checked === true)
    let totalPrice = 0
    let totalNum = 0
    cartData.forEach(i => {
      if (i.checked) {
        totalPrice += i.num * i.goods_price
        totalNum += i.num
      }
    })
    this.setData({
      cartData,
      address,
      totalPrice,
      totalNum
    })
  },
  // 
  async handlePay() {
    let token = wx.getStorageSync('token');
    if(!token) {
      wx.navigateTo({url: '/pages/auth/index'});
      return
    } 
    const address = this.data.address
    const totalPrice = this.data.totalPrice
    const cartData = this.data.cartData
    token = wx.getStorageSync('token');
    console.log('123')  
    let goods = []
    cartData.forEach(i => {
      goods.push({
        goods_id: i.goods_id,
        goods_number: i.num,
        goods_price: i.goods_price
      })
    })
    const res = await request({
      url: '/my/orders/create',
      header: {
        Authorization: token
      },
      method: 'POST',
      data: {
        order_price: totalPrice,
        consignee_addr: address,
        goods
      }
    })
    wx.requestPayment({
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: '',
      paySign: '',
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
      
  }
})