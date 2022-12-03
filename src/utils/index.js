const unitConverter = function (num, digits = 0) {
  let obj = {
    value: num,
    unit: ''
  }
  if (num > 1000000000000) {
    obj = {
      value: (num / 1000000000000).toFixed(digits),
      unit: '万亿'
    };
  } else if (num > 100000000000) {
    obj = {
      value: (num / 100000000000).toFixed(digits),
      unit: '千亿'
    };
  } else if (num > 10000000000) {
    obj = {
      value: (num / 10000000000).toFixed(digits),
      unit: '百亿'
    };
  } else if (num > 100000000) {
    obj = {
      value: (num / 100000000).toFixed(digits),
      unit: '亿'
    };
  } else if (num > 10000) {
    obj = {
      value: (num / 10000).toFixed(digits),
      unit: '万'
    };
  }
  return obj;
}

export default {
  unitConverter
}