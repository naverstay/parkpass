import React from 'react';
import dayjs from 'dayjs';
import dayjsPluginUTC from 'dayjs-plugin-utc';
import { DATE_FORMAT } from '../api/api';

dayjs.extend(dayjsPluginUTC);

export const Submission = ({
  pickerMode,
  setPickerMode,
  setSubmissionDate,
  pickerInputRef,
  setOpenTimePicker,
  rollDateRef,
  onSubmit,
}) => {
  const now = dayjs();

  return (
    <div className="submission">
      <div className="submission-top">
        <div className="title">Время подачи?</div>
        <div className="text">Минимальное время подачи 10 мин.</div>
      </div>

      <div className="submission-date">
        <div
          className={'btn btn-transp ' + (pickerMode === 'today' ? '__active' : '')}
          onClick={() => {
            setPickerMode('today');
          }}
        >
          Сегодня
        </div>
        <div
          className={'btn btn-transp ' + (pickerMode === 'tomorrow' ? '__active' : '')}
          onClick={() => {
            setPickerMode('tomorrow');
          }}
        >
          Завтра
        </div>
        {/*<div*/}
        {/*  className={*/}
        {/*    'btn btn-transp ' + (pickerMode === 'date' || pickerMode === 'time' ? '__active' : '')*/}
        {/*  }*/}
        {/*  onClick={() => {*/}
        {/*    setSubmissionDate('');*/}
        {/*    setPickerMode('date');*/}
        {/*  }}*/}
        {/*>*/}
        {/*  Выбрать дату*/}
        {/*</div>*/}
      </div>
      <div className={'submission-time'}>
        <input
          ref={pickerInputRef}
          defaultValue={now.format(DATE_FORMAT)}
          className="hidden"
          type="text"
        />
        <div ref={rollDateRef} className={'submission-picker __' + pickerMode} />
      </div>

      <div className="submission-confirm">
        <button
          className="btn btn-blue"
          onClick={() => {
            setOpenTimePicker(false);
          }}
        >
          <span>Отмена</span>
        </button>
        <button className="btn btn-green" onClick={onSubmit}>
          <span>Готово</span>
        </button>
      </div>
    </div>
  );
};
