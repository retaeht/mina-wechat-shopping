// pages/goods_detail/index.js
import { request } from "../../request/index.js"
import "../../lib/runtime/runtime"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 商品详情数据
    goodsDetail: [],
    isCollect: false
  },
  onShow() {
    let currentPages = getCurrentPages();
    currentPages = currentPages[currentPages.length - 1]
    const goods_id = currentPages.options.goods_id
    this.getGoodsDetail(parseInt(goods_id))
  },
  goodsAllDetail: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { goods_id } = options
    this.getGoodsDetail(parseInt(goods_id))
  },
  // 获取商品详情数据
  async getGoodsDetail(id) {
    const collect = wx.getStorageSync('collect') || [];
    let res = await request({
      url: '/goods/detail',
      data: { goods_id: id }
    })
    res = res.data.message
    this.goodsAllDetail = res
    let isCollect = collect.some(i => {
      return i.goods_id === this.goodsAllDetail.goods_id
    })
    // console.log(res)
    this.setData({
      goodsDetail: {
        goods_name: res.goods_name,
        goods_price: res.goods_price,
        goods_introduce: res.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: res.pics,
        goods_small_log: res.goods_small_logo,
        goods_id: res.goods_id,
      },
      isCollect: isCollect
    })
  },
  // 轮播图预览图
  previewImage(e) {
    const { index } = e.currentTarget.dataset
    const urls = this.data.goodsDetail.pics.map(item => {
      return item.pics_big
    })
    console.log(urls)
    wx.previewImage({
      urls,
      current: index
    })
  },
  // 添加商品
  handleAddCart() {
    console.log('132')
    let cart = wx.getStorageSync('cart') || []
    let index = cart.findIndex(i => i.goods_id === this.goodsAllDetail.goods_id)
    if (index === -1) {
      this.goodsAllDetail.num = 1
      this.goodsAllDetail.checked = true
      cart.push(this.goodsAllDetail)
    } else {
      cart[index].num++
    }
    wx.setStorageSync('cart', cart)
    wx.showToast({
      title: '已加入购物车',
      mask: false
    });
  },
  // 是否收藏
  handleCollectChange() {
    let flag = !this.data.isCollect
    let collect = wx.getStorageSync('collect') || [];
    let goodsDetail = this.data.goodsDetail
    this.setData({
      isCollect: flag
    })
    if (flag) {
      collect.push(goodsDetail)
      wx.setStorageSync('collect', collect);
    } else {
      collect.forEach((el, i) => {
        if (el.goods_id === goodsDetail.goods_id) {
          collect.splice(i, 1)
          wx.setStorageSync('collect', collect);
        }
      })
    }
  }
})