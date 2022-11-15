import React, { useEffect, useMemo, useRef } from 'react';
import { OrderData } from './OrderData';
import { Progress } from './Progress';
import { ProgressBar } from './ProgressBar';
import { appDayJS } from '../helpers/functions';

export const Order = ({
  parkingData,
  setOpenSubmissionTime,
  setOpenTimePicker,
  windowScrollTop,
}) => {
  const { state } = parkingData;
  const orderHeaderRef = useRef(null);

  const submissionStatus = useMemo(() => {
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

    return STATUSES[(parkingData?.state || 1) - 1];
  }, [parkingData?.state]);

  const submissionTime = useMemo(() => {
    return parkingData?.car_delivery_time ? appDayJS(parkingData.car_delivery_time) : '';
  }, [parkingData]);

  useEffect(() => {
    const el = orderHeaderRef.current;
    const observer = new IntersectionObserver(
      ([e]) => e.target.classList.toggle('__pinned', e.intersectionRatio < 1),
      { threshold: [1] },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="order">
      <div ref={orderHeaderRef} className="order-top">
        <div className="title">{parkingData?.parking?.name}</div>
        <div className="text">{parkingData?.parking?.address}</div>
      </div>

      <div className="order-container">
        {state > 3 ? (
          <>
            {submissionTime ? (
              <div className="order-info">
                <div className="order-info__item">
                  <p>Время подачи Авто:</p>
                  <div className="order-info__time">
                    {submissionTime.utcOffset(0).format('HH:mm')}
                  </div>
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

            <OrderData parkingData={parkingData} />

            {submissionTime ? null : (
              <div className="order-info__help">
                <div className="btn btn-blue">
                  <span>Мне нужна помощь</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <OrderData parkingData={parkingData} />
        )}
      </div>

      <div className="order-booking">
        {[4, 5, 6].indexOf(state) > -1 ? (
          <Progress parkingData={parkingData} />
        ) : state === 7 ? (
          <ProgressBar percent={100} text={submissionStatus} />
        ) : state > 7 ? null : (
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
