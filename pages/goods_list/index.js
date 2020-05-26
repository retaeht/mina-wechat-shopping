// pages/goods_list/index.js
import { request } from '../../request/index.js'
import '../../lib/runtime/runtime'
Page({

  data: {
    // 标签信息
    tabs: [
      { id: 0,
        name: "综合",
        isActive: true  
      },
      { id: 1,
        name: "销量",
        isActive: false  
      },
      { id: 2,
        name: "价格",
        isActive: false  
      }
    ],
    // 请求列表参数
    queryParam: {
      cid: '',
      pagenum: 1,
      pagesize: 5,
      query: ''
    },
    // 商品列表数据
    goodsList: []
  },

  onLoad: function (options) {
    const cid = options.cid || ''
    const query = options.query || ''
    this.data.queryParam.cid = cid
    this.data.queryParam.query = query
    this.getGoodsList()
  },
  // 标题点击事件，从子向父传值
  tabItemChange(e) {
    const {index} = e.detail
    const {tabs} = this.data
    tabs.forEach(item => {
      item.id === index ? item.isActive = true : item.isActive = false
    })
    this.setData({
      tabs
    })
  },
  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({
      url: '/goods/search',
      data: this.data.queryParam
    })
    // 获取总条数
    const total = res.data.message.total
    const totalPage = Math.ceil(total / this.data.queryParam.pagesize)
    this.setData({
      totalPage
    })
    this.setData({
      goodsList: [...this.data.goodsList, ...res.data.message.goods]
    })
    wx.stopPullDownRefresh()
    
      
  },
  //  滚动条触底事件
  onReachBottom() {
    if(this.data.queryParam.pagenum >= this.data.totalPage) {
      wx.showToast({
        title: '没有更多'
      });
        
    }else {
      this.data.queryParam.pagenum++
      this.getGoodsList()
    }
  },
  // 下拉刷新事件
  onPullDownRefresh() {
    // 1.清除当前数据
    // 2.当前页码为一
    // 3.发送请求
    // 5.关闭下拉刷新窗口
    this.setData({
      goodsList: []
    })
    this.data.queryParam.pagenum = 1
    this.getGoodsList()
  }
})