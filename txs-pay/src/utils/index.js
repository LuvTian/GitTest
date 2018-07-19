/**
 * Created by jiachenpan on 16/11/18.
 */

export function formatDate (date, fmt) {
  //指定fmt 格式，按照fmt格式输出
  //未指定fmt 按照语义化输出。
  if (!date) return '';
  function getDateStr(d) {
    if (!d) return '';
    if(d>0) return parseInt(d);
    return d.toString().replace('T', ' ').replace(/-/g, '/').split('+')[0].split('.')[0];
  }

  function _isDate(date) {
    return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
  }

  if (!_isDate(date))
    date = new Date(getDateStr(date));
  var now = new Date(),
    o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
      "q+": Math.floor((date.getMonth() + 3) / 3),
      "S": date.getMilliseconds()
    },
    format = function (fmt) {
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    };
  if (fmt) {
    return format(fmt);
  } else {
    return format('yyyy-MM-dd hh:mm:ss');
  }
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

export function fmoney(s, n, t) {
    // 格式化金额
    if (!s)
        return '0.00';
    n = n >= 0 && n <= 20 ? n : 2;
    s = parseFloat(s + '');
    if (t) {
        const pow = Math.pow(10, n);
        if (t === 1) {
            s = Math.floor(s * pow) / pow;
        } else if (t === 2) {
            s = Math.ceil(s * pow) / pow;
        }
    }
    s = s.toFixed(n) + '';
    const arr = s.split('.');
    const l = arr[0].split('').reverse();
    const r = arr[1];
    t = '';
    for (let i = 0; i < l.length; i++) {
        t += '' + l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '');
    }
    return t.split('').reverse().join('') + ((n === 0) ? '' : '.' + r);
}
