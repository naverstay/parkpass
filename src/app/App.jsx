import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import dayjs from 'dayjs';
import Rolldate from '../vendor/rolldate';
import { Home } from '../pages/Home';
import { useWindowDimension } from '../hooks/useWindowDimension';
import Sprite from '../images/webpack-logo.svg';
import City from '../images/city.png';
import '../styles/main.scss';

let rtPicker = null;

const appHeight = () => {
  // eslint-disable-next-line no-console
  const doc = document.documentElement;
  const sab = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab')) || 0;
  doc.style.setProperty('--app-height', `${Math.max(200, window.innerHeight - sab)}px`);
};

export const App = () => {
  const now = dayjs();
  const tomorrow = now.add(1, 'day');
  const pickerInputRef = useRef(null);
  const rollDateRef = useRef(null);
  const windowSize = useWindowDimension().join(',');
  const [pickerMode, setPickerMode] = useState('time');
  const [submissionDate, setSubmissionDate] = useState(now);

  useEffect(() => {
    appHeight();
  }, [windowSize]);

  useEffect(() => {
    const targetTime = dayjs().add(1, 'hour');
    // eslint-disable-next-line no-console
    console.log('rollTimeRef', pickerInputRef, targetTime.format('YYYY-MM-DD HH:mm'));

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

    if (pickerInputRef.current && rollDateRef.current) {
      rtPicker = new Rolldate({
        el: pickerInputRef.current,
        container: rollDateRef.current,
        format: 'YYYY-MM-DD hh:mm',
        alwaysOpen: true,
        minStep: 5,
        lang,
        value: targetTime.format('YYYY-MM-DD HH:mm'),
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
      pickerInputRef.current.click();
    }
  }, []);

  const dateDiff = useMemo(
    () => (submissionDate ? submissionDate.diff(now.format('YYYY-MM-DD'), 'day') : -1),
    [submissionDate, now],
  );

  return (
    <div className="page">
      <div className="header">
        <span>PARKPASS VALET SERVICE</span>
        <img src={City} alt="" />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/help" element={<Sprite />} />
        </Routes>
      </BrowserRouter>
      <div className="footer">
        <div className="footer-container">
          <div className="submit">
            <button className="btn btn-green __w-100">
              <span>Подать автомобиль</span>
            </button>
          </div>
        </div>

        <div className="footer-container">
          <div className="order">
            <div className="order-top">
              <div className="title">Жилой Квартал Prime Park</div>
              <div className="text">Трубная площадь, 2</div>
            </div>
          </div>
        </div>

        <div className="footer-container __open">
          <div className="submission">
            <div className="submission-top">
              <div className="title">Время подачи?</div>
              <div className="text">Минимальное время подачи 10 мин.</div>
            </div>

            <div className="submission-date">
              <div
                className={'btn btn-transp ' + (dateDiff === 0 ? '__active' : '')}
                onClick={() => {
                  setPickerMode('time');
                  setSubmissionDate(now);
                }}
              >
                Сегодня
              </div>
              <div
                className={'btn btn-transp ' + (dateDiff === 1 ? '__active' : '')}
                onClick={() => {
                  setPickerMode('time');
                  setSubmissionDate(tomorrow);
                }}
              >
                Завтра
              </div>
              <div
                className={
                  'btn btn-transp ' + (dateDiff > 1 || pickerMode === 'date' ? '__active' : '')
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
                id="rollTime"
                ref={pickerInputRef}
                readOnly
                className="hidden"
                type="text"
                placeholder="Выберите время"
              />
              <div ref={rollDateRef} className={'submission-picker __' + pickerMode} />
            </div>
          </div>
        </div>
      </div>
      <div className="overlay" />
    </div>
  );
};
