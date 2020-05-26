// 同时发送异步的次数
let ajaxTimes = 0
export const request = (options) => {
  wx.showLoading({
    title: "正在请求",
    mask: true
  })
  ajaxTimes++
  const base = "https://api-hmugo-web.itheima.net/api/public/v1"
  return new Promise((reslove, reject) => {
    wx.request({
      ...options,
      url: base + options.url,
      success: (result) =>{
        reslove(result)
      },
      fail: (err) => {
        reject(err)
        wx.hideLoading()
      },
      complete: () => {
        // 等到全部请求结束关闭提示
        ajaxTimes--
        if(ajaxTimes <= 0) {
          ajaxTimes = 0
          wx.hideLoading()
        }
      } 
    })
  })
}

// 封装给 wx.showToast
export const showToast = (content) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      ...content,
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    })
  }) 
}