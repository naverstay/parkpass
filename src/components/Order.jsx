import React from 'react';
import { OrderData } from './OrderData';

export const Order = ({ parkingData, setOpenSubmissionTime }) => {
  return (
    <div className="order">
      <div className="order-top">
        <div className="title">{parkingData?.parking?.name}</div>
        <div className="text">{parkingData?.parking?.address}</div>
      </div>

      <div className="order-container">
        <OrderData parkingData={parkingData} />
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
