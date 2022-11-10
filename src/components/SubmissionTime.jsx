import React from 'react';

export const SumbissionTime = ({
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

            sendBookRequest();
          }}
        >
          <span>Сейчас</span>
        </button>
      </div>
    </div>
  );
};
