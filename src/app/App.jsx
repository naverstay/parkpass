import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Rolldate from '../vendor/rolldate';
import { Home } from '../pages/Home';
import { useWindowDimension } from '../hooks/useWindowDimension';
import Sprite from '../images/webpack-logo.svg';
import City from '../images/city.png';
import '../styles/main.scss';

const appHeight = () => {
  // eslint-disable-next-line no-console
  const doc = document.documentElement;
  const sab = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab')) || 0;
  doc.style.setProperty('--app-height', `${Math.max(200, window.innerHeight - sab)}px`);
};

export const App = () => {
  const rolldateRef = useRef(null);
  const windowSize = useWindowDimension().join(',');

  useEffect(() => {
    appHeight();
  }, [windowSize]);

  useEffect(() => {
    const now = new Date();
    const targetTime = new Date(now.setHours(now.getHours() + 1));
    // eslint-disable-next-line no-console
    console.log('rolldateRef', rolldateRef);

    const lang = {
      title: 'Время',
      cancel: 'Отмена',
      confirm: 'Готово',
      year: 'год',
      month: 'мес',
      day: 'день',
      hour: '',
      min: '',
      sec: '',
    };

    if (rolldateRef.current) {
      let rr = new Rolldate({
        el: rolldateRef.current,
        parent: rolldateRef.current.parentElement,
        lang,
        format: 'hh:mm',
        alwaysOpen: true,
        minStep: 5,
        value:
          targetTime.getFullYear() +
          '-' +
          (targetTime.getMonth() + 1) +
          '-' +
          targetTime.getDate() +
          ' ' +
          targetTime.getHours() +
          ':' +
          targetTime.getMinutes(),
        beginYear: targetTime.getFullYear(),
        endYear: now.getFullYear() + 1,
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
          console.log('confirm');
        },
        cancel: function () {
          // eslint-disable-next-line no-console
          console.log('cancel');
        },
      });

      // eslint-disable-next-line no-console
      console.log('Rolldate', rr);
    }
  }, []);

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
              <div className="btn btn-transp">Сегодня</div>
              <div className="btn btn-transp">Завтра</div>
              <div className="btn btn-transp">Выбрать дату</div>
            </div>
            <div className="submission-time">
              <input
                id="rolldate"
                ref={rolldateRef}
                readOnly
                className="form-control"
                type="text"
                placeholder="Выберите время"
              />
            </div>
            <div className="submission-confirm">
              <button className="btn btn-blue">
                <span>Отмена</span>
              </button>
              <button className="btn btn-green">
                <span>Готово</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="overlay" />
    </div>
  );
};
