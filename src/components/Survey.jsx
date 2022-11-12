import React from 'react';
import { Link } from 'react-router-dom';
import { Progress } from './Progress';

export const Survey = ({ parkingData }) => {
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

      <Progress parkingData={parkingData} />
    </div>
  );
};
