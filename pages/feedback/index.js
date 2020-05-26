// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 标签信息
    tabs: [
      {
        id: 0,
        name: "体验问题",
        isActive: true
      },
      {
        id: 1,
        name: "商品投诉",
        isActive: false
      }
    ],
    upImgPath: [],
    textareaContent: ''
  },
  // 图床的token https://img.coolcr.cn/
  netPath: [],
  token: '',
  onLoad() {
    wx.request({
      url: "https://img.coolcr.cn/api/token",
      data: {
        email: '857143640@qq.com',
        password: "m123456"
      },
      method: 'POST',
      success: (result) => {
        this.token = result.data.data.token
      }
    })

  },
  handlechangeActive(e) {
    const { index } = e.detail
    let tabs = this.data.tabs
    tabs.forEach(i => i.id === index ? i.isActive = true : i.isActive = false)
    this.setData({
      tabs
    })
  },
  handleUpImg() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          upImgPath: [...this.data.upImgPath, ...result.tempFilePaths]
        })
      }
    });
  },
  handleDeleteImg(e) {
    const index = e.detail.index
    let upImgPath = this.data.upImgPath
    upImgPath.splice(index, 1)
    this.setData({
      upImgPath
    })
  },
  handleGetTextarea(e) {
    this.setData({
      textareaContent: e.detail.value
    })
  },
  handleSubmit() {
    const textareaContent = this.data.textareaContent
    if (!textareaContent.trim()) {
      wx.showToast({
        title: '文本为空！！',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: true
      });
      return
    }
    const upImgPath = this.data.upImgPath
    wx.showLoading({
      title: "正在上传",
      mask: true
    });
    if(upImgPath.length != 0) {
      upImgPath.forEach((i, index) => {
        wx.uploadFile({
          url: 'https://img.coolcr.cn/api/upload',
          filePath: i,
          name: 'image',
          formData: {},
          header: { 'Authorization': this.token },
          success: (result) => {
            const url = JSON.parse(result.data)
            this.netPath.push(url)
            console.log(this.netPath)
            // 当循环完数组 将 地址和文本一并上传到服务器
            if (index === upImgPath.length - 1) {
              console.log("以上传至服务器")
              // 清空页面
              this.setData({
                upImgPath: [],
                textareaContent: ''
              })
              wx.hideLoading();
              wx.showToast({title: '上传成功'});
            }
          },
          fail: () => {
            wx.hideLoading();
            wx.showToast({title: '上传失败'});
          }
        });
  
      })
    }else {
      console.log("只上传文本")
      wx.hideLoading();
    }
    
  }
})