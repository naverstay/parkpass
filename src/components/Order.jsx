import React, { useMemo } from 'react';
import { MEDIA_URL } from '../api/api';
import dayjs from 'dayjs';
import { dateDiff } from '../helpers/functions';

export const Order = ({ parkingData, setOpenSubmissionTime }) => {
  const parkDuration = useMemo(() => {
    const parkStart = parkingData?.started_at ? dayjs(parkingData.started_at) : '';

    if (!parkStart) return '';

    const now = dayjs();

    return dateDiff(parkStart, now, true);
  }, [parkingData]);

  const number = parkingData?.car_number || '';
  const model = parkingData?.car_model || '';
  const image =
    MEDIA_URL +
    '/api/media' +
    (parkingData?.photos?.length ? parkingData.photos[0]?.img || '' : '');

  const parkPlace = parkingData?.parking_place || '';
  const price = (parkingData?.debt || '0.00') + ' ₽';
  const startTime = parkingData?.started_at
    ? dayjs(parkingData.started_at).format('DD.MM.YYYY в HH:mm')
    : '';

  const valetCard = parkingData?.parking_card || '';

  return (
    <div className="order">
      <div className="order-top">
        <div className="title">{parkingData?.parking?.name}</div>
        <div className="text">{parkingData?.parking?.address}</div>
      </div>

      <div className="order-container">
        <div className="order-box">
          <div className="order-box__car">
            <img src={image} alt="Car" />
          </div>
          <div className="order-box__model">{model}</div>
          <div className="order-box__number">{number}</div>
        </div>

        <dl className="order-options">
          <div className="order-option icon __time">
            <dt>Время въезда:</dt>
            <dd>{startTime}</dd>
          </div>
          <div className="order-option icon __time">
            <dt>Время на парковке:</dt>
            <dd>{parkDuration}</dd>
          </div>
          <div className="order-option icon __card">
            <dt>Номер Valet-карты</dt>
            <dd>{valetCard}</dd>
          </div>
          <div className="order-option icon __info">
            <dt>Место парковке:</dt>
            <dd>{parkPlace}</dd>
          </div>
          <div className="order-option icon __info">
            <dt>Стоимость:</dt>
            <dd>{price}</dd>
          </div>
        </dl>

        <div className="order-info__help">
          <div className="btn btn-blue">
            <span>Мне нужна помощь</span>
          </div>
        </div>
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
  );
};
