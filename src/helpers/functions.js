import dayjs from 'dayjs';

export const CHECK_STATUS_TIMER = 5000;

export function debounce(fn, ms) {
  let timer;
  return (_) => {
    clearTimeout(timer);
    timer = setTimeout((_) => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

export const leadZero = (val) => {
  return String('0' + val).slice(-2);
};

export const getClosestTime = (d2, step, param) => {
  let date2 = dayjs(d2);
  const val = date2.get(param);

  date2 = date2.set(param, val + (val % step));

  return date2;
};

export const dateDiff = (d1, d2, p) => {
  const date1 = dayjs(d1);
  const date2 = dayjs(d2);
  const periods = ['л', 'м', 'д', 'ч', 'мин'];
  const addVal = (val, str) => (val > 0 ? val + str + ' ' : '');

  const years = date1.diff(date2, 'y'),
    months = years * 12 - date1.diff(date2, 'M'),
    days = years * 365 - date1.diff(date2, 'd') - months * 30,
    hours = years * 365 * 24 - date1.diff(date2, 'h') - days * 24 - months * 30 * 24,
    minutes =
      years * 365 * 24 * 60 -
      date1.diff(date2, 'm') -
      hours * 60 -
      days * 24 * 60 -
      months * 30 * 24 * 60;

  const ret = [years, months, days, hours, minutes];

  if (p) {
    return ret
      .map((d, di) => addVal(d, periods[di]))
      .join(' ')
      .trim();
  } else {
    return ret;
  }
};

export const getScrollTop = () => {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
};
