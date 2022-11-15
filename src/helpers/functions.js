import dayjs from 'dayjs';
import dayjsPluginUTC from 'dayjs-plugin-utc';
import duration from 'dayjs/plugin/duration';
import { DATE_FORMAT } from '../api/api';

dayjs.extend(dayjsPluginUTC);
dayjs.extend(duration);

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
  let ret = dayjs(d2);
  const val = ret.get(param);
  ret = ret.set(param, step + val - (val % step));
  return ret;
};

export const dateDiff = (d1, d2, p, h) => {
  const date1 = dayjs(d1);
  const date2 = dayjs(d2);
  const duration = dayjs.duration(date2.diff(date1));
  const periods = ['л', 'м', 'д', 'ч', 'мин'];
  const addVal = (val, str) => (val > 0 ? val + str + ' ' : '');

  //const years = date1.diff(date2, 'y'),
  //  //months = years * 12 - date1.diff(date2, 'M'),
  //  months = date1.diff(date2, 'M') % 12,
  //  days = date1.diff(date2, 'd') % 30,
  //  hours = date1.diff(date2, 'h') % 365,
  //  minutes =
  //    years * 365 * 24 * 60 -
  //    date1.diff(date2, 'm') -
  //    hours * 60 -
  //    days * 24 * 60 -
  //    months * 30 * 24 * 60;

  const ret = [
    duration.$d.years,
    duration.$d.months,
    duration.$d.days,
    duration.$d.hours + h,
    duration.$d.minutes,
  ];

  //const ret = [years, months, days, hours, minutes];

  // eslint-disable-next-line no-console
  //console.log('dateDiff', date1.format(DATE_FORMAT), date2.format(DATE_FORMAT), ret, duration.$d);

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
