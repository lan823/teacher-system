/**
 * 时间戳转化为时分秒
 * @param {*} time //时间戳
 */ 

function formatTime(time) {
  //将秒转化为时分秒
  var hour, minute, second;
  hour = Math.floor(time / 3600);
  hour = hour > 9 ? hour : '0' + hour;
  minute = Math.floor((time % 3600) / 60);
  minute = minute > 9 ? minute : '0' + minute;
  second = Math.floor(time % 60);
  second = second > 9 ? second : '0' + second;
  return hour + ':' + minute + ':' + second;
}





