// pages/student/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    studentInfo: [],
    scrollTop: undefined
  },
  /**
   * Add a new student to the list
   */
  addStudent: function() {
    let newStudent = "Carrol";
    let studentList = this.data.studentList;
    studentList.push(newStudent);
    this.setData({
      studentList: studentList
    });
  },
  showStudentInfo(event){
    //console.log(event)
    var item = event.currentTarget.dataset.id;
    const db = wx.cloud.database();
    db.collection('StudentInfo').doc(item._id).get(
      {
        success:function(res){
          wx.lin.showDialog({
            type: "alert",     
            title: res.data.Name,
            content: "剩余课时: " + res.data.RemainClassNum,
            success: () => {}
          })
        }
      }
    );
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function () {
    this.readData()
  },
  onPageScroll(res){
    this.setData({
      scrollTop:res.scrollTop
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
    this.readData()
  },

  readData: function(){
    const db = wx.cloud.database()
    const studentCollection = db.collection("StudentInfo")
    studentCollection.get().then(res => {
      this.setData({
        studentInfo: res.data
      });
      // console.log(res.data)
    }).catch(err => {
      console.error(err);
    });
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