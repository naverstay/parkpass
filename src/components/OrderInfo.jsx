import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { dateDiff } from '../helpers/functions';
import { ProgressBar } from './ProgressBar';

let updateTimer;
let updateDurationTimer;

export const OrderInfo = ({ parkingData, setOpenTimePicker, setOpenSubmissionTime }) => {
  const STATUSES = [
    'Автомобиль принят',
    'Парковка автомобиля',
    'Автомобиль припаркован',
    'В процессе подачи',
    'В процессе подачи',
    'В процессе подачи',
    'Машина ожидает',
    'Машина выдана',
    'Машина выдана',
    'Машина выдана',
  ];
  const submissionStatus = STATUSES[parkingData?.state || 0];
  const submissionTime = parkingData?.car_delivery_time ? dayjs(parkingData.car_delivery_time) : '';
  const submissionStart = parkingData?.started_at ? dayjs(parkingData.started_at) : '';
  // eslint-disable-next-line no-console
  console.log('parkingData', parkingData);

  const submissionPeriod =
    submissionTime && submissionStart ? submissionTime.diff(submissionStart, 's') : '';
  const [submissionDuration, setSubmissionDuration] = useState(
    submissionTime ? submissionTime.diff(dayjs(), 's') : 0,
  );
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    clearInterval(updateDurationTimer);

    if (submissionTime) {
      updateDurationTimer = setInterval(() => {
        setSubmissionDuration(submissionTime.diff(dayjs(), 's'));
      }, 5000);
    }

    return () => {
      clearInterval(updateDurationTimer);
    };
  }, [submissionTime, submissionStart]);

  useEffect(() => {
    clearInterval(updateTimer);

    updateTimer = setInterval(() => {
      setNow(dayjs());
    }, 10000);

    return () => {
      clearInterval(updateTimer);
    };
  }, []);

  const timeLeft = useMemo(() => {
    return dateDiff(now, submissionTime, true);
  }, [now, submissionTime]);

  const percentLeft = useMemo(() => {
    return (100 * (submissionPeriod - submissionDuration)) / submissionPeriod;
  }, [submissionDuration, submissionPeriod]);

  return (
    <div className="order">
      <div className="order-top">
        <div className="title">{parkingData?.parking?.name}</div>
        <div className="text">{parkingData?.parking?.address}</div>
      </div>

      <div className="order-container">
        {submissionTime ? (
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
        ) : null}

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

        {submissionTime ? null : (
          <div className="order-info__help">
            <div className="btn btn-blue">
              <span>Мне нужна помощь</span>
            </div>
          </div>
        )}
      </div>

      <div className="order-footer">
        {submissionTime ? (
          <ProgressBar text={'Осталось: ' + timeLeft} percent={100 - percentLeft} />
        ) : (
          <button
            className="btn btn-green"
            onClick={() => {
              setOpenSubmissionTime(true);
            }}
          >
            <span>Подать автомобиль</span>
          </button>
        )}
      </div>
    </div>
  );
};
