框架： mina

使用的单位rpx：可以根据不同屏幕宽度进行自适应。

屏幕默认宽：750rpx

确定设计稿宽度 

- 公式：设计稿宽度px = 750rpx ,因此 1px = 750rpx / 设计稿宽度
- 设计稿宽 / 高 = 750rpx /  ？

swiper组件 默认宽高： 100%*150px

image组件 默认宽高：320px*240px ;

mode: widthFix宽度固定，高度自适应

wxss 设置值为变量：var(--xxx)

 

发送请求失败：

1.详情 -> 本地设置->不校验合法域名

2.项目部署阶段：小程序个人后台->开发->开发后台 添加域名

 

修改data中的数据：this.setData({ }) 



用到的事件：

bindtap: 点击事件

bindchange:checked-group

bindinput：文本输入事件 value属性获取方式：e.detail.value

navigator:open-type="switchTab" 跳转tab页面



获取登录的用户信息：open-type="getUserInfo"

 

传参方式：

- navigator组件 url传值：onLoad() ->      e.options

- data-xxx传值：e.currentTarget.datase

- 子组件向父组件传值：

  - this.triggerEvent()：子向父传值 ->bind：方法名，“参数”
  - e.detail

- onShow想要获取传递来的参数 （onShow生命周期：页面每次显示都触发）

- - getCurrentPages() 获取当前小程序的页面栈 -数组 长度最大十个页面
  - 数组中索引最大的页面就是当前页面       pages[pages.length - 1]
  - 参数在options属性中

\-----------------------------------------------------------------------------------

### 商品分类业务逻辑：

1. 商品分类的数据大，不适合频繁发送请求，采用本地存储

2. - 获取本地存储数据 

   - 判断是否存在 是否过期：当前时间戳  - 定义的时间戳 >  规定时间

   - - 添加时间戳 存储到storage

   - 获取数据

3. 分别存储商品标题和默认第一项的内容数据

4. 根据标题索引获取数据中对应内容数据

5. 让渲染内容保持在顶部： sroll-view组件的srcoll-top 动态设置为0

 

### 商品列表业务逻辑：

1. 初始化请求参数：分类id 页码 页数

2. 页面上滑加载下一页 

   api：onReachBottom（）

   json：enablePullDownRefresh:true

   - 判断是否为最后一页：当前页码 ≥ 总页码 公式：总页码 = 总条数 / 页数
   - 页码++ 发送请求

3. 下拉刷新 onPullDownRefresh()

1. 1. 清空数组
   2. 重置页码为 1
   3. 发送请求

 

### 商品详情页业务逻辑：

1. 添加收藏

2. 1. 判断是否收藏 some遍历storage中收藏数组

   2. - findIndex -> splice-> isColl: false
      - push-> isColl: true

1. 图片预览：previewImage（）

2. 1. 获取所有图片链接 urls map()
   2. 获取当前图片链接 url  data-xxx 

1. 加入购物车：

2. 1. 获取本地购物车数组

   2. 判断是否存在 findIndex

   3. 1. 添加num属性，添加checked属性 push()

3. 1. num++  添加到本地

 

### 购物车业务逻辑：

- 计算总价格 购买数量 全选

- - 遍历购物车每一项的 checked属性 

  - 判断是否为选中 

  - - 全选属性：false

  - 计算 总价格 购买总数 

  - 验证数组是否为空 为空 全选为false

  - 添加到本地存储

- 全选/全不选

- - 全选属性：取反
  -  foreach
  - 调用计算方法 重新计算

- 商品选中/未选中

- - forEach数组 当前checked取反 
  - 调用计算方法 重新计算

- 商品 +-

- - data-xxx传递id、和 +1、-1

  - findIndex找到当前商品索引

  - 判断当前num是否 等于1并且是否为减法操作

  - - 删除当前项 splice()

- - num--       \num--

- - 调用计算方法 重新计算

- 结算

- - 判断地址是否为空/选中数量是否为空

  - - 提示用户 return

  - 跳转支付页面 navigateTo()

 

获取对小程序 地址的权限 状态

1. 调用用户权限 查看地址权限状态 api: wx.getSetting()
2. 判断用户是否给予获取地址权限：res.authSetting['scope.address']
   - 如果为 true / undefined -> 可以获取地址权限
   - 如果为 false -> 诱导用户打开地址权限:  wx.openSetting() 

3. 获取用户地址：wx.chooseAddress

 

### 支付业务逻辑：

1. try catch 捕获错误信息 提示用户支付失败

2. 遍历checked项 filter()

3. 获取地址信息

4. 获取总数量 总价格

5. 支付

6. 1. 判断是否有token

   2. 1. 跳转授权页面 
      2. 获取用户信息        open-type="getUserInfo"
      3. 获取小程序登录 code  api：login()
      4. 获取token 发送请求 本地存储
      5. navigateBack() 返回上一级

   3. 获取订单编号 发送请求 创建订单  携带token 商品信息等

   4. 发起预支付请求 携带token 订单编号

   5. 微信支付api: requestPayment 传入预付订单对象

   6. 查看订单支付状态 发送请求 携带token 订单编号

   7. 提示用户

7. 清空本地存储中checked的项

8. 更新cart数据

9. 跳转订单页面

 

### 意见反馈业务逻辑：

1. 获取文本域输入内容： e.detail.vaue

2. 选取图片 api：chooseImage（）

3. 1. 成功回调中添加链接到数组

   2. 1. 连续上传 使用展开运算符: [        …old, …result ]

1. 提交信息

2. 1. 判断内容是否合法 trim()

   2. 判断是否有图片 [].length === 0

   3. - 上传文字

   4. 上传图片 返回网络地址

   5. 1. 添加提示信息：showLoading
      2. 图片上传 api：uploadFile（）每次只能上传一张 forEach
      3. 对返回值转换成JSON格式
      4. push到网络url数组中
      5. 上传文字与图片
      6. 索引 === [ ].length - 1 调用：hideLoding()
      7. 重置页面

 

### 上传图片到服务器 返回外网链接

wxuploadFile({

url: 上传到哪里

filePath:被上传的路径

name: 属性名

})

- formData: 其他文本信息
- 只能依次上传 遍历数组
- 上传
- 维护新的数组