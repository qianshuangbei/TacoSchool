// pages/classroom/index.js
Page({
  /**
   * Page initial data
   */
  data: {
    studentInfo: [],
    schedule: [],
    classInfo: [],
    todaylessons: [],
    todayidx: 0,
    daysOfWeek : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },
  getDayOfWeek: function(){
    const today = new Date();
    const idx = today.getDay();
    this.setData({
      todayidx: idx})
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.getDayOfWeek()
    this.init()
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
  ToRoll: function(e) {
    wx.navigateTo({
      url: '../rollcall/index',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function(data) {
          console.log("acceptDataFromOpenedPage")
        },
        someEvent: function(data) {
          console.log("someEvent")
        }
      },
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: e.currentTarget.dataset.idx})
      }
    })
  },
  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  readStudentInfo: function(db){
    const studentCollection = db.collection("StudentInfo")
    studentCollection.get().then(res=> {{
        this.setData({
          studentInfo: res.data
        })
        var classArray = new Array()
        for(var i = 0; i < res.data.length; i++){
          var student = res.data[i];
          var name = student.Name;
          var class_list = student.Classroom;
          for(var j = 0; j < class_list.length; j++){
            var class_idx = class_list[j].split('_')
            var week_idx = parseInt(class_idx[0])
            var idx = parseInt(class_idx[1])
            if(this.data.todayidx != week_idx){
              continue
            }
            while(classArray.length < idx+1){
              classArray.push(new Array())
            }
            classArray[idx].push(student)
          }
        }
        this.setData({
          classInfo: classArray
        })
        wx.setStorageSync("TodayClassInfo", classArray)
      }
    })
  },

  readClassSchedule: function(db){
    const scheduleDB = db.collection("Schedule")
    scheduleDB.get().then(res=> {
      this.setData(
        {
          schedule: res.data
        }
      )
    })
    scheduleDB.where({
      'Idx': this.data.todayidx
    }).get().then(res => {
      this.setData({
        todaylessons: res.data[0].Time
      })
      wx.setStorageSync('todaylessons', res.data[0].Time)
    });
  },

  init: function(){
    const db = wx.cloud.database()
    this.readClassSchedule(db)
    this.readStudentInfo(db)
  }
  
})