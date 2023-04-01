// pages/rollcall/index.js
Page({

  /**
   * Page initial data
   */
  data: {
  },
  
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (option) {
    console.log(option.query)
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('acceptDataFromOpenedPage', {data: 'test'});
    eventChannel.emit('someEvent', {data: 'test'});
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      console.log(data)
    })
  },
  showRollCall(event){
    var name = event.currentTarget.dataset.id;
    wx.lin.showDialog({
      type:"confirm",     
      title:"点 名",
      content: name + " 签 到 ",
      success: (res) => {
        if (res.confirm) {
          this.confirmRollCall()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  
  confirmRollCall(){
    console.log('用户点击确定')
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