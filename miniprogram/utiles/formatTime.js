module.exports = (dates) => {
  let fmt = 'yyyy-MM-dd hh:mm:ss'
  let date = new Date(dates);
  const o = {
    'M+': date.getMonth() + 1, // 获取月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), //分钟
    's+': date.getSeconds(), // 秒
  }
  if(/(y+)/.test(fmt)) {
    // RegExp.$1 === yyyy
    fmt = fmt.replace(RegExp.$1, date.getFullYear())
  }
  for(let k in  o) {
    // new RegExp('(' + k + ')') 每次 指定就是 /M+/  /d+/ /h+/ /m+/ /s+/
    if(new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, o[k].toString().length == 1 ? '0' + o[k]: o[k])
    }
  }
  return fmt
}