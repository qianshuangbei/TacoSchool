// pages/rollcall/index.js
const db = wx.cloud.database()
const _ = db.command
var studentCollection = db.collection('StudentInfo')

Page({

  /**
   * Page initial data
   */
  data: {
    currentClassInfo: [],
    time: "",
    index: 0,
    today: "",
  },
  
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (option) {
    var today = new Date();
    // Get the current year, month and day
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    // Format the date as a string
    var formattedDate = year + '-' + month + '-' + day;
    this.setData({today: formattedDate})

  },
  showRollCall(event){
    var student = event.currentTarget.dataset.id;
    var order_key = this.data.today + student.Name
    if(wx.getStorageSync(order_key) == 100){
      return
    }
    wx.lin.showDialog({
      type:"confirm",     
      title:"点 名",
      content: student.Name + " 签 到 ",
      success: (res) => {
        if (res.confirm) {
          this.confirmRollCall(student)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  
  confirmRollCall(option){
    var order_key = this.data.today + option.Name
    console.log("To confirm" + order_key)
    var order_flag = 0
    if(wx.getStorageSync(order_key) != 100){
      console.log("first time :" + order_key)
      wx.setStorage({
        key: order_key,
        data: 101
      })
      order_flag = 101
    }else{
      console.log(order_key + "already exist!")
      order_flag = wx.getStorageSync(order_key)
    }
    
    if (order_flag == 101){
      studentCollection.doc(option._id).update({
        data:{
          RemainClassNum: _.inc(-1)
        },
        success: function(res) {
          console.log("Success roll call " + order_key)
          wx.setStorage({
            key: order_key,
            data: 100
          })
        }
      })
      db.collection('Log').add({
        data:{
          date: new Date(),
          student: option.Name
        }
      })
    }else{
      console.log('重复点名')
    }
  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    var classInfo =  wx.getStorageSync('TodayClassInfo');
    var todaylessons = wx.getStorageSync('todaylessons');
    const eventChannel = this.getOpenerEventChannel()
    var idx = 0
    eventChannel.emit('acceptDataFromOpenedPage', {data: 'test'});
    eventChannel.emit('someEvent', {data: 'test'});
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      idx = data.data
    })
    // console.log(idx)
    // console.log(todaylessons[idx])
    // console.log(classInfo[idx+1])
    this.setData({index: idx})
    this.setData({time: todaylessons[idx]})
    this.setData({currentClassInfo: classInfo[idx+1]})
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {
  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})