import React, { useMemo, useState } from 'react';
import { DATE_FORMAT, MEDIA_URL } from '../api/api';
import { appDayJS, dateDiff } from '../helpers/functions';

export const OrderData = ({ parkingData, now }) => {
  const parkDuration = useMemo(() => {
    const parkStart = parkingData?.started_at ? appDayJS(parkingData.started_at) : '';

    if (!parkStart) return '';

    // eslint-disable-next-line no-console
    //console.log(
    //  'parkDuration',
    //  now.format(DATE_FORMAT),
    //  parkStart.format(DATE_FORMAT),
    //  now.diff(parkStart, 'm'),
    //);

    return dateDiff(parkStart, now.add(parkStart.utcOffset(), 'm'), true, 1);
  }, [parkingData, now]);

  const number = parkingData?.car_number || '';
  const model = parkingData?.car_model || '';
  const image =
    MEDIA_URL +
    '/api/media' +
    (parkingData?.photos?.length ? parkingData.photos[0]?.img || '' : '');

  const parkPlace = parkingData?.parking_place || '';
  const price = (parkingData?.debt || '0.00') + ' ₽';
  const startTime = parkingData?.started_at
    ? appDayJS(parkingData.started_at).utcOffset(0).format('DD.MM.YYYY в HH:mm')
    : '';

  const valetCard = parkingData?.valet_card_id || '';

  return (
    <>
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
    </>
  );
};
