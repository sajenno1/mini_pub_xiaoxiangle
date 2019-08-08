//index.js
// 引入SDK核心类
const QQMapWX = require('../../static/txMapSDK/qqmap-wx-jssdk.min.js');
const qqmap = new QQMapWX({
  key: 'AHXBZ-PQ2W4-GQLUD-D5CUI-GFZ2T-QXB6V'
});

//
const _scrollX = wx.getSystemInfoSync().windowWidth ;

//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    address: '点击获取当前地址',
    addName: '点击获取当前地址',
    myLatitude: 0,
    myLongitude: 0,
    defAddress: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    indicatorDots: true,
    autoplay: true,
    circular: true,
    interval: 3000,
    duration: 1000,
    menuList: [{
        label: '休闲食品'
      },
      {
        label: '粮油米面'
      },
      {
        label: '奶品水饮'
      },
      {
        label: '中外名酒'
      },
      {
        label: '方便速食'
      },
      {
        label: '个人护理'
      },
      {
        label: '家清家居'
      },
      {
        label: '美容护肤'
      },
      {
        label: '收纳日用'
      },
    ],
    menuRow: 5, //菜单每行显示个数
    menuColumn: 2, //菜单行数
    menuCurrent: 0, //当前菜单
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    let that = this
    //用微信提供的api获取经纬度
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        that.setData({
          myLatitude: res.latitude,
          myLongitude: res.longitude
        })
        //用腾讯地图的api，根据经纬度获取城市
        qqmap.reverseGeocoder({
          location: {
            latitude: that.data.myLatitude,
            longitude: that.data.myLongitude
          },
          success: res => {
            let a = res.result.address_component
            //获取市和区（区可能为空）
            that.setData({
              defAddress: a.city + a.district
            })
            //控制台输出结果
          },
          fail: e => {
            console.log(e)
          }
        })
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getLocation: function(e) {
    let _this = this;
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: res => {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.openLocation({
          latitude,
          longitude,
          scale: 18,
          success: res => {
            wx.chooseLocation({
              success: res => {
                _this.setData({
                  address: res.address,
                  addName: res.name
                })
              }
            })
          }
        })
      },
      fail: function(res) {
        console.log('fail');
      },
      complete: function(res) {},
    })
  },
  swiperChange: function (e) {//菜单滑动
    console.log(1)
    var that = this;
    if (e.detail.source == 'touch') {
      that.setData({
        menuCurrent: e.detail.current,
      })
    }
  }, 
})