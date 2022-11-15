import React from 'react';
import { DATE_FORMAT } from '../api/api';
import { appDayJS, getClosestTime } from '../helpers/functions';

export const SubmissionTime = ({
  setOpenSubmissionTime,
  setOpenTimePicker,
  rtPicker,
  sendBookRequest,
}) => {
  return (
    <div className="submission">
      <div className="submission-top">
        <div className="title">Время подачи?</div>
        <div className="text">Минимальное время подачи 10 мин.</div>
      </div>

      <div className="submission-confirm">
        <button
          className="btn btn-blue"
          onClick={() => {
            setOpenTimePicker(true);
            setOpenSubmissionTime(false);
          }}
        >
          <span>Ко времени</span>
        </button>
        <button
          className="btn btn-green"
          onClick={() => {
            setOpenSubmissionTime(false);
            rtPicker
              .setDate(getClosestTime(appDayJS().add(10, 'm'), 5, 'm').format(DATE_FORMAT))
              .render();

            sendBookRequest();
          }}
        >
          <span>Сейчас</span>
        </button>
      </div>
    </div>
  );
};
