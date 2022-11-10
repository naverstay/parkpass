import React, { useEffect, useState } from 'react';
import { ProgressBar } from './ProgressBar';
import { dateDiff } from '../helpers/functions';
import dayjs from 'dayjs';

let updateTimer;

export const Rating = ({ parkingData }) => {
  const submissionTime = parkingData?.car_delivery_time ? dayjs(parkingData.car_delivery_time) : '';
  const submissionStart = parkingData?.started_at ? dayjs(parkingData.started_at) : '';
  // eslint-disable-next-line no-console
  console.log('parkingData', parkingData);

  const submissionPeriod = submissionTime.diff(submissionStart, 's');
  const [submissionDuration, setSubmissionDuration] = useState(0);
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    clearInterval(updateTimer);

    updateTimer = setInterval(() => {
      setSubmissionDuration(submissionTime.diff(dayjs(), 's'));
    }, 30000);

    return () => {
      clearInterval(updateTimer);
    };
  }, [submissionTime, submissionStart]);

  return (
    <div className="order">
      <div className="order-top">
        <div className="title">{parkingData?.parking?.name}</div>
        <div className="text">{parkingData?.parking?.address}</div>
      </div>

      <div className="order-container">
        <div className="order-info__item">
          <div className="order-survey__title">
            Как вы в целом оцениваете <br /> качество Валет сервиса?
          </div>
          <div className="order-survey__rating">
            <div className="rating">
              <input name="stars" id="e5" type="radio" />
              <label htmlFor="e5">★</label>
              <input name="stars" id="e4" type="radio" />
              <label htmlFor="e4">★</label>
              <input name="stars" id="e3" type="radio" />
              <label htmlFor="e3">★</label>
              <input name="stars" id="e2" type="radio" />
              <label htmlFor="e2">★</label>
              <input name="stars" id="e1" type="radio" />
              <label htmlFor="e1">★</label>
            </div>

            {/*<div className="rating rating2">*/}
            {/*  <a href="#5" title="Give 5 stars">*/}
            {/*    ★*/}
            {/*  </a>*/}
            {/*  <a href="#4" title="Give 4 stars">*/}
            {/*    ★*/}
            {/*  </a>*/}
            {/*  <a href="#3" title="Give 3 stars">*/}
            {/*    ★*/}
            {/*  </a>*/}
            {/*  <a href="#2" title="Give 2 stars">*/}
            {/*    ★*/}
            {/*  </a>*/}
            {/*  <a href="#1" title="Give 1 star">*/}
            {/*    ★*/}
            {/*  </a>*/}
            {/*</div>*/}
          </div>
        </div>

        <div className="order-info__item">
          <p>Информация о валет сервисе</p>
          <div className="order-info__info">
            Автомобиль будет подан на -1 уровне паркинга у лифтового холла.
            <br />
            <br />
            Служба поддержки Valet Service: <br />
            <a href="https://t.me/valetprime">https://t.me/valetprime</a>
          </div>
        </div>

        <div className="order-info__item">
          <p>Помогите нам стать лучше...</p>

          <form action="#" className="order-survey__form">
            <div className="order-survey__title">Хотите что-то добавить?</div>

            <div className="order-survey__input">
              <input placeholder="Ваше сообщение здесь" className="input input-white" type="text" />
            </div>

            <div className="order-survey__buttons">
              <div className="btn btn-blue">Не хочу</div>
              <button type="submit" className="btn btn-green">
                Отправить
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="order-footer">
        <ProgressBar
          text={'Осталось: ' + dateDiff(now, submissionTime, true)}
          percent={100 - (submissionPeriod - submissionDuration) / submissionPeriod}
        />
      </div>
    </div>
  );
};
