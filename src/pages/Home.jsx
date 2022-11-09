import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Rolldate from 'pickerjs';
import City from '../images/city.png';
import Car from '../images/car_1.png';
import { Order } from '../components/Order';
import { API_URL, apiFetchGet, apiFetchPost } from '../api/api';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm';

let rtPicker = null;

export const Home = () => {
  const now = dayjs();
  const pickerInputRef = useRef(null);
  const rollDateRef = useRef(null);
  const [pickerMode, setPickerMode] = useState('today');
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [openOrder, setOpenOrder] = useState(true);
  const [openSubmissionTime, setOpenSubmissionTime] = useState(false);
  const [submissionDate, setSubmissionDate] = useState(now);
  const [parkingData, setParkingData] = useState(null);
  let [searchParams, setSearchParams] = useSearchParams();

  const sendBookRequest = () => {
    const VCID = searchParams.get('VCID');
    apiFetchPost({ date: dayjs(rtPicker.getDate()).format(DATE_FORMAT), id: VCID }, 'book/').then(
      (r) => {
        // eslint-disable-next-line no-console
        console.log('sendBookRequest', r);
      },
    );
  };

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('searchParams', Object.fromEntries(searchParams));

    const P = searchParams.get('P');
    const VCID = searchParams.get('VCID');
    const PCID = searchParams.get('PCID');

    if (P && VCID) {
      apiFetchGet('get/?id=' + VCID + '&P=' + P).then((d) => {
        // eslint-disable-next-line no-console
        console.log('fetch', d);

        setParkingData(d);
      });
    }
  }, [searchParams]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(
      'submissionDate',
      submissionDate,
      submissionDate && submissionDate.format(DATE_FORMAT),
    );
    rtPicker?.setDate((submissionDate || dayjs()).format(DATE_FORMAT)).render();
  }, [submissionDate]);

  useEffect(() => {
    const targetTime = dayjs().add(1, 'hour');
    // eslint-disable-next-line no-console
    console.log('rollTimeRef', pickerInputRef, targetTime.format(DATE_FORMAT));

    const lang = {
      title: '',
      cancel: 'Отмена',
      confirm: 'Готово',
      year: '',
      month: '',
      day: '',
      hour: '',
      min: '',
      sec: '',
    };

    if (rtPicker) {
      rtPicker.setDate(targetTime.format(DATE_FORMAT)).render();
    } else if (pickerInputRef.current && rollDateRef.current) {
      rtPicker = new Rolldate(pickerInputRef.current, {
        //el: pickerInputRef.current,
        //alwaysOpen: true,
        //minStep: 5,
        //lang,
        //format: DATE_FORMAT,
        container: rollDateRef.current,
        text: lang,
        rows: 3,
        increment: {
          year: 1,
          month: 1,
          day: 1,
          hour: 1,
          minute: 1,
          second: 10,
          millisecond: 100,
        },
        inline: true,
        format: DATE_FORMAT,
        value: targetTime.format(DATE_FORMAT),
        beginYear: targetTime.format('YYYY'),
        endYear: parseInt(targetTime.format('YYYY')) + 1,
        init: function (e) {
          // eslint-disable-next-line no-console
          console.log('init');
        },
        moveEnd: function (scroll) {
          // eslint-disable-next-line no-console
          console.log('moveEnd', scroll);
        },
        confirm: function (date) {
          // eslint-disable-next-line no-console
          console.log(date);
          // eslint-disable-next-line no-console
          console.log('confirm', date);
        },
        cancel: function () {
          // eslint-disable-next-line no-console
          console.log('cancel');
        },
      });

      // eslint-disable-next-line no-console
      //console.log('rollTimeRef', rtPicker);
      //pickerInputRef.current.click();
    }
  }, [openTimePicker]);

  const dateDiff = useMemo(
    () => (submissionDate ? submissionDate.diff(now.format('YYYY-MM-DD'), 'day') : -1),
    [submissionDate, now],
  );

  return (
    <>
      <div className="header">
        <span>PARKPASS VALET SERVICE</span>
        <img src={City} alt="" />
      </div>

      <div className="footer">
        <div
          className={
            'footer-container' +
            (openOrder ? ' __open' : '') +
            (openSubmissionTime || openTimePicker ? ' __overlay' : '')
          }
        >
          <div className="order">
            <div className="order-top">
              <div className="title">Жилой Квартал Prime Park</div>
              <div className="text">Трубная площадь, 2</div>
            </div>

            <div className="order-container">
              <Order
                number={'Х349НО178'}
                model={'BMW'}
                image={Car}
                parkTime={'25 Д. 4 Ч. 39 МИН.'}
                parkPlace={'-1 этаж, D29'}
                price={'400 ₽'}
                startTime={'03.08.2020 в 13:30'}
                valetCard={'221331242442'}
              />
            </div>

            <div className="order-footer">
              <button
                className="btn btn-green"
                onClick={() => {
                  setOpenSubmissionTime(true);
                }}
              >
                <span>Подать автомобиль</span>
              </button>
            </div>
          </div>
        </div>

        <div className={'footer-container' + (openSubmissionTime ? ' __open' : '')}>
          <div className="submission">
            <div className="submission-top">
              <div className="title">Время подачи?</div>
              <div className="text">Минимальное время подачи 10 мин.</div>
            </div>

            <div className="submission-confirm">
              <button
                className="btn btn-blue"
                onClick={() => {
                  setOpenTimePicker(true);
                  setOpenSubmissionTime(false);
                }}
              >
                <span>Ко времени</span>
              </button>
              <button
                className="btn btn-green"
                onClick={() => {
                  setOpenSubmissionTime(false);
                  // eslint-disable-next-line no-console
                  console.log('send request', rtPicker.getDate());

                  sendBookRequest();
                }}
              >
                <span>Сейчас</span>
              </button>
            </div>
          </div>
        </div>

        <div className={'footer-container' + (openTimePicker ? ' __open' : '')}>
          <div className="submission">
            <div className="submission-top">
              <div className="title">Время подачи?</div>
              <div className="text">Минимальное время подачи 10 мин.</div>
            </div>

            <div className="submission-date">
              <div
                className={'btn btn-transp ' + (pickerMode === 'today' ? '__active' : '')}
                onClick={() => {
                  setPickerMode('today');
                  setSubmissionDate(dayjs());
                }}
              >
                Сегодня
              </div>
              <div
                className={'btn btn-transp ' + (pickerMode === 'tomorrow' ? '__active' : '')}
                onClick={() => {
                  setPickerMode('tomorrow');
                  setSubmissionDate(dayjs().add(1, 'd'));
                }}
              >
                Завтра
              </div>
              <div
                className={
                  'btn btn-transp ' +
                  (pickerMode === 'date' || pickerMode === 'time' ? '__active' : '')
                }
                onClick={() => {
                  setSubmissionDate('');
                  setPickerMode('date');
                }}
              >
                Выбрать дату
              </div>
            </div>
            <div className={'submission-time'}>
              <input
                ref={pickerInputRef}
                defaultValue={now.format(DATE_FORMAT)}
                className="hidden"
                type="text"
              />
              <div ref={rollDateRef} className={'submission-picker __' + pickerMode} />
            </div>

            <div className="submission-confirm">
              <button
                className="btn btn-blue"
                onClick={() => {
                  setOpenTimePicker(false);
                }}
              >
                <span>Отмена</span>
              </button>
              <button
                className="btn btn-green"
                onClick={() => {
                  // eslint-disable-next-line no-console

                  const time = dayjs();
                  const date = dayjs(rtPicker.getDate());

                  if (pickerMode === 'date') {
                    setPickerMode('time');
                  } else {
                    // eslint-disable-next-line no-console
                    console.log('send request', rtPicker.getDate());
                    sendBookRequest();
                  }

                  if (date.diff(time, 'm') < 0) {
                    rtPicker.setDate(time.add(1, 'h').format(DATE_FORMAT)).render();
                    setPickerMode('today');
                  }

                  // eslint-disable-next-line no-console
                  console.log(rtPicker.getDate(), date.diff(time, 'm'));
                }}
              >
                <span>Готово</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={'overlay ' + (openTimePicker || openOrder || openSubmissionTime ? '__show' : '')}
      />
    </>
  );
};
