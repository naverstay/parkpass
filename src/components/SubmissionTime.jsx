import React from 'react';
import { DATE_FORMAT } from '../api/api';
import { getClosestTime } from '../helpers/functions';

// dayjs
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
//import dayjsPluginUTC from 'dayjs-plugin-utc';
import advanced from 'dayjs/plugin/advancedFormat';

dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(advanced);

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
              .setDate(getClosestTime(dayjs().add(10, 'm'), 5, 'm').format(DATE_FORMAT))
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
