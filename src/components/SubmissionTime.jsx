import React from 'react';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '../api/api';

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
            // eslint-disable-next-line no-console
            console.log('send request', rtPicker.getDate());

            const time = dayjs();
            const date = dayjs(rtPicker.getDate());

            if (date.diff(time, 'm') < 10) {
              rtPicker.setDate(time.add(11, 'm').format(DATE_FORMAT)).render();
            }

            sendBookRequest();
          }}
        >
          <span>Сейчас</span>
        </button>
      </div>
    </div>
  );
};
