$(document).ready(function () {
  // TODO: 声明变量的时候，为了避免全局变量的污染，最好用闭包
  var timerDate; // 后台取时间戳
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

  //调取题目
  $.ajax({
    type: "POST",
    url: "http://dev.jiayouxueba.cn/jyxb-quiz/external/online-quiz/start-quiz",
    headers: {
      auth: localStorage.getItem('auth'),
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    data: {
    },
    success: function (res) {
      console.log('res..', res);
      timerDate = res.data.time_remain;
      quizNo = res.data.quiz_no;
      var quizSet = res.data.quiz_set;
      quizSet.map(function(item,index){
        // $('.test-wrapper').html();
        var testContainer = 
        "<div class='topic-container'>" +
          "<h2>" + (index+1) + '.' + item.title + "</h2>" +
          "<ol>" +
            "<li>" +
              "<input type='radio'" + "name=" + item.id + "  data-value=" + Math.pow(2,0) +
              "  data-id=" + item.id + ">" +
              "<label for=''>" + item.choiceList[0] + "</label>"+
            "</li>"+
            "<li>" +
              "<input type='radio'" + "name=" + item.id + "  data-value=" + Math.pow(2,1) +
              "  data-id=" + item.id + ">" +
              "<label for=''>" + item.choiceList[1] + "</label>"+
            "</li>"+
            "<li>" +
              "<input type='radio'" + "name=" + item.id + "  data-value=" + Math.pow(2,2) +
              "  data-id=" + item.id + ">" +
              "<label for=''>" + item.choiceList[2] + "</label>"+
            "</li>"+
            "<li>" +
              "<input type='radio'" + "name=" + item.id + "  data-value=" + Math.pow(2,3) +
              "  data-id=" + item.id + ">" +
              "<label for=''>" + item.choiceList[3] + "</label>"+
            "</li>"+
          "</ol>"+
        "</div>";
        $('.test-wrapper').append(testContainer);
      });
      // 点击选项题目
      $('.topic-container ol li').on('click', 'input', function(){
        var id = $(this).data('id');
        var value = $(this).data('value');
        paramMap['choice_' + id] = value;
        console.log('paramMap...', paramMap);
      })
    },
    fail: function (err) {
      alert(err.msg);
    },
    complete: function (data) {
      // console.log(data);
    }
  })

  
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
    //$.ajax()
    $.ajax({
      type: "POST",
      url: "http://dev.jiayouxueba.cn/jyxb-quiz/external/online-quiz/submit-quiz",
      headers: {
        auth: localStorage.getItem('auth'),
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      data: {
        quizNo: quizNo,
        paramMap: JSON.stringify(paramMap),
      },
      success: function (res) {
        // var res = JSON.stringify(res);
        // if ( res.data. ===0 ) {
        //   alert('提前交卷成功');
        // }else {
        //   alert('提前交卷失败')
        // }
      },
      fail: function (err) {
        alert(err.msg);
      },
      complete: function (data) {
        // console.log(data);
      }
    });
  });

  $('.modalAuto').on('click', '.modalBottom', function () {
    //自动交卷
    clearInterval(disappearTimer);
    clearInterval(timer);
    //$.ajax
    $('.modalAuto').fadeOut();
    alert('查看考试结果')
  })

  $('.modalBack .modalBottom').on('click', '.cancel', function () {
    //  退出考试系统 - 取消
    $('.modalBack').fadeOut();
  });
  $('.modalBack .modalBottom').on('click', '.confirm', function () {
    // 退出考试系统 - 确认
    clearInterval(disappearTimer);
    clearInterval(timer);
    $('.countDown .timer').find('span').html('00:00:00');
    //$.ajax()
    $('.modalBack').fadeOut();
    alert('退出考试系统')
  });
})