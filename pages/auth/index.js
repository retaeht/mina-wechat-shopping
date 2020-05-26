// pages/auth/index.js
import { request } from '../../request/index'
Page({
  data: {

  },
   handleGetUserInfo(e) {
    // 获取用户信息
    const { encryptedData, rawData, iv, signature } = e.detail
    let code
    // 獲取小程序登錄code
    wx.login({
      timeout: 10000,
      success: async (result) => {
        code = result.code
        console.log(result)
        let loginParams = { encryptedData, rawData, iv, signature, code }
        // 發送請求獲取用戶token
        const res = await request({
          url: "/users/wxlogin",
          method: 'post',
          data: loginParams
        })
        wx.setStorageSync("token", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo");
          
        wx.navigateBack({
          delta: 1
        });
      }

    });


  }
})