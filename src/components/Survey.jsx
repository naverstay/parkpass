import React, { useEffect, useState } from 'react';
import { MEDIA_URL } from '../api/api';
import { ProgressBar } from './ProgressBar';
import { dateDiff } from '../helpers/functions';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

let updateTimer;

export const Survey = ({ parkingData }) => {
  const submissionTime = parkingData?.car_delivery_time ? dayjs(parkingData.car_delivery_time) : '';
  const submissionStart = parkingData?.started_at ? dayjs(parkingData.started_at) : '';
  // eslint-disable-next-line no-console
  console.log('parkingData', parkingData);

  const submissionPeriod = submissionTime.diff(submissionStart, 's');
  const [submissionDuration, setSubmissionDuration] = useState(submissionTime.diff(dayjs(), 's'));
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

  useEffect(() => {
    clearInterval(updateTimer);

    updateTimer = setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => {
      clearInterval(updateTimer);
    };
  }, []);

  return (
    <div className="order">
      <div className="order-top">
        <div className="title">{parkingData?.parking?.name}</div>
        <div className="text">{parkingData?.parking?.address}</div>
      </div>

      <div className="order-container">
        <div className="order-info__item">
          <div className="order-survey__title">
            Помогите нам стать лучше, <br /> пройдите небольшой опрос
          </div>

          <div className="order-survey__buttons">
            <Link to={'/'} className="btn btn-blue">
              В следующий раз
            </Link>
            <Link to={'/rating'} className="btn btn-blue">
              Да, давайте
            </Link>
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
