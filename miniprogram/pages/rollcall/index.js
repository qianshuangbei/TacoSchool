// pages/rollcall/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    currentClassInfo: [],
    time: "",
    index: 0,
  },
  
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (option) {
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
    console.log(idx)
    this.setData({index: idx})
    this.setData({time: todaylessons[idx]})
    this.setData({currentClassInfo: classInfo[idx+1]})
  },
  showRollCall(event){
    var student = event.currentTarget.dataset.id;
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
    const db = wx.cloud.database()
    console.log('用户点击确定')
    const _ = db.command
    console.log(option._id)
    db.collection('StudentInfo').doc(option._id).update({
      data:{
        RemainClassNum: _.inc(-1)
      },
      success: function(res) {
        console.log(res.data)
      }
    })
    db.collection('Log').add({
      data:{
        date: new Date(),
        student: option.Name
      }
    })

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