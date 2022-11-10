import React from 'react';

export const Order = ({
  model,
  image,
  number,
  startTime,
  valetCard,
  parkTime,
  price,
  parkPlace,
}) => {
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
          <dd>{parkTime}</dd>
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
    </>
  );
};
