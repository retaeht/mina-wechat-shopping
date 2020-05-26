// pages/cart/index.js
import { showToast } from '../../request/index'
Page({

  data: {
    address: {},
    cartData: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    let address = wx.getStorageSync('address') || [];
    let cartData = wx.getStorageSync('cart') || [];
    this.setData({
      address
    })
    this.setCart(cartData)
  },
  // 点击 收货地址
  handleChooseAddress() {
    // 先获取权限状态 api
    wx.getSetting({
      success: (res) => {
        const scope = res.authSetting['scope.address']
        if (scope === true || scope === undefined) {
          wx.chooseAddress({
            success: (res) => {
              wx.setStorageSync('address', res);
            }
          })
        } else {
          // 权限设置 api
          wx.openSetting({
            success: () => {
              wx.chooseAddress({
                success: (res) => {
                  wx.setStorageSync('address', res);
                }
              })
            }
          })
        }
      }
    })
  },
  // 切换选中状态
  handleCheckded(e) {
    const id = e.currentTarget.dataset.id
    let cartData = this.data.cartData
    let index = cartData.findIndex(i => {
      return i.goods_id === id
    })
    cartData[index].checked = !cartData[index].checked
    this.setCart(cartData)
    wx.setStorageSync('cart', cartData)
  },
  // 全选 全不选
  handleAllCheckded() {
    let { cartData, allChecked } = this.data
    allChecked = !allChecked
    cartData.forEach(i => {
      i.checked = allChecked
    })
    this.setCart(cartData)
    wx.setStorageSync('cart', cartData)
  },
  // 加减商品数量
  handleNumEdit(e) {
    let { id, operation } = e.currentTarget.dataset
    let { cartData } = this.data
    const index = cartData.findIndex(i => {
      return i.goods_id === id
    })
    operation = operation === "+1" ? 1 : -1
    // 判断是否删除购物车
    if (cartData[index].num === 1 && operation === -1) {
      wx.showModal({
        title: '是否删除',
        showCancel: true,
        success: (result) => {
          if (result.confirm) {
            cartData.splice(index, 1)
            this.setCart(cartData)
            wx.setStorageSync('cart', cartData)
          }
        }
      });
    } else {
      cartData[index].num += operation
      this.setCart(cartData)
      wx.setStorageSync('cart', cartData)
    }
  },
  // 购物车结算
  async handlePay() {
    const { totalNum, address } = this.data
    // if(address.length === 0) {
    //   wx.showToast({
    //     title: '请填写收货地址',
    //     icon: 'none',
    //     image: '',
    //     duration: 1500,
    //     mask: false,
    //     success: (result) => {

    //     }
    //   });
    // }else if(totalNum.length === 0) {
    //   wx.showToast({
    //     title: '购物车为空',
    //     icon: 'none'
    //   });
    // }else {
    //   wx.navigateTo({
    //     url: '/pages/pay/index'
    //   });
    // }

    if (address.length === 0) {
      await showToast({
        title: '请填写收货地址',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false
      })
      return
    } else if (totalNum.length === 0) {
      await showToast({
        title: '购物车为空',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false
      })
      return
    } else {
      wx.navigateTo({
        url: '/pages/pay/index'
      });
    }
  },
  // 设置购物车状态同时 重新计算 全选 总价格 购买数量
  setCart(cartData) {
    console.log(cartData)
    let allChecked = true
    let totalPrice = 0
    let totalNum = 0
    cartData.forEach(i => {
      if (i.checked) {
        totalPrice += i.num * i.goods_price
        totalNum += i.num
      } else {
        allChecked = false
      }
    })
    allChecked = cartData.length != 0 ? allChecked : false
    this.setData({
      cartData,
      allChecked,
      totalPrice,
      totalNum
    })
  }
})