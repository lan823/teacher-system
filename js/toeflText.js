$(document).ready(function () {
  // TODO: 声明变量的时候，为了避免全局变量的污染，最好用闭包
  var timerDate=305; // 后台取时间戳
  var surplusTime = 300; // 剩余5分钟
  var disappearTime = 295; //消失时间
  var disappearDater = 5; // 显示时间
  var timer;
  var disappearTimer;
  var quizNo; // 题库编号
  var paramMap = {}; // 完成的题目信息
  timer = setInterval(function () {
    $('.countDown .timer').find('span').html(formatTime(timerDate));
    timerDate--;
    if (timerDate === surplusTime - 1) {
      $('.counterTip').fadeIn();
      disappearTimer = setInterval(function () {
        $('.cancel').find('span').html(disappearDater - 1);
        disappearDater--;
      }, 1000);
      if (disappearDater <= 0) {
        clearInterval(disappearTimer);
      }
    } else if (timerDate === disappearTime - 1) {
      $('.counterTip').fadeOut();
    } else if (timerDate <= 0) {
      // 清除定时器
      clearInterval(timer);
      $('.countDown .timer').find('span').html('00:00:00');
      //自动交卷
      $('.modalAuto').fadeIn();
    }
  }, 1000);
   //页面初始化调用登陆接口
   $.ajax({
    type: "POST",
    url: "https://dev.jiayouxueba.cn/jyxb-quiz/external/login",
    data: {
      mobile: 18773215120,
      password: 123456,
    },
    success: function (res) {
      // var res = JSON.stringify(res);
      var auth = res.data.auth;
      localStorage.setItem('auth', auth);
    },
    fail: function (err) {
      alert(err.msg);
    },
    complete: function (data) {
      // console.log(data);
    }
  });
  // 调取考试题目
  $.ajax({
    type:"post",
    url:"",


  })
  // 输入框
  $("textarea").click(function() {
    $(".require").hide()
    $(".subject").hide()
    $("textarea").css({
      "marigin-top":".27rem",
      "width":"6.9rem",
      "height":"10.78rem",
    })
     
  } )
  
  // })
  $('.countDown').on('click', '.submit', function () {
    // 提前交卷
    $('.modalAdvance').fadeIn();
  });
  $('.modalAdvance .modalBottom').on('click', '.cancel', function () {
    //  提前交卷 - 取消
    $('.modalAdvance').fadeOut();
  });
  $('.modalAdvance .modalBottom').on('click', '.confirm', function () {
    // 提前交卷 - 确认
    clearInterval(disappearTimer);
    clearInterval(timer);
    $('.countDown .timer').find('span').html('00:00:00');
    $('.modalAdvance').fadeOut();
  });

  $('.modalAuto').on('click', '.modalBottom', function () {
    //自动交卷
    clearInterval(disappearTimer);
    clearInterval(timer);
    
  })
 
 



 

})