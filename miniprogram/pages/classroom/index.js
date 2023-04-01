// pages/classroom/index.js
Page({
  /**
   * Page initial data
   */
  data: {
    studentInfo: [],
    classInfo: [],
    schedule: [],
    todaylessons: [],
    todayidx: 0,
    daysOfWeek : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },
  getDayOfWeek: function(){
    const today = new Date();
    const idx = today.getDay();
    this.setData({
      todayidx: idx})
    console.log("Today is " + this.data.todayidx);
    console.log(today)
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
    console.log("OnReady")
    this.getClassInfo()
    for(var i = 0; i < this.data.todaylessons.length; i++){
      var classMap = new Map();
      classMap.set("Teacher", "Shella");
      classMap.set("Time", this.data.schedule[i])
      classMap.set("Student", new Array());
      this.data.classInfo.push(classMap)
    }
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    console.log("Onshow")
    console.log(this.data.studentInfo)
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
  ToRoll: function() {
    wx.navigateTo({
      url: '../rollcall/index',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function(data) {
          console.log(data)
        },
        someEvent: function(data) {
          console.log(data)
        }
      },
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test'})
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
    studentCollection.get({
      success: function(res) {
        this.setData({
          studentInfo: res.data
        })
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
      console.log(res.data[0].Time)
      this.setData({
        todaylessons: res.data[0].Time
      })
    });
    console.log(this.data.todaylessons)
  },

  init: function(){
    const db = wx.cloud.database()
    this.readClassSchedule(db)
    this.readStudentInfo(db)
  },

  getClassInfo: function(){
    for(var i = 0; i < this.data.studentInfo.length; i++){
      var student = this.data.studentInfo[i];
      var name = student.Name;
      var class_list = student.Classroom;
      for(var j = 0; j < class_list.length; j++){
        var class_idx = class_list[j].split('_')
        var week_idx = parseInt(class_idx[0])
        var idx = parseInt(class_idx[1])
        if(this.data.todayidx == week_idx){
          this.data.classInfo[idx]["Student"].push(student)
        }
      }
    }
  }
  
})