import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { dateDiff } from '../helpers/functions';
import { ProgressBar } from './ProgressBar';

let updateTimer;

export const OrderInfo = ({ parkingData }) => {
  const submissionStatus = parkingData?.state || '';
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

  useEffect(() => {
    clearInterval(updateTimer);

    updateTimer = setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => {
      clearInterval(updateTimer);
    };
  }, []);

  // eslint-disable-next-line no-console
  console.log('submissionDuration', submissionDuration, submissionPeriod);

  return (
    <div className="order">
      <div className="order-top">
        <div className="title">{parkingData?.parking?.name}</div>
        <div className="text">{parkingData?.parking?.address}</div>
      </div>

      <div className="order-container">
        <div className="order-info">
          <div className="order-info__item">
            <p>Время подачи Авто:</p>
            <div className="order-info__time">{submissionTime.format('HH:mm')}</div>
          </div>
          <div className="order-info__item">
            <p>Статус подачи</p>
            <div className="order-info__status">{submissionStatus}</div>
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
