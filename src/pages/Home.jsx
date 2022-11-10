import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Rolldate from 'pickerjs';

import { Order } from '../components/Order';
import { API_URL, apiFetchGet, apiFetchPost, DATE_FORMAT, fixtures, MEDIA_URL } from '../api/api';
import { Sumbission } from '../components/Submission';
import { SumbissionTime } from '../components/SubmissionTime';
import { OrderInfo } from '../components/OrderInfo';

let rtPicker = null;

export const Home = () => {
  const now = dayjs();
  const pickerInputRef = useRef(null);
  const rollDateRef = useRef(null);
  const [pickerMode, setPickerMode] = useState('today');
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [openOrder, setOpenOrder] = useState(false);
  const [showOrderInfo, setShowOrderInfo] = useState(false);
  const [openSubmissionTime, setOpenSubmissionTime] = useState(false);
  const [submissionDate, setSubmissionDate] = useState(now);
  const [parkingData, setParkingData] = useState(null); // fixtures
  let [searchParams, setSearchParams] = useSearchParams();

  const checkBookStatus = () => {
    const VCID = searchParams.get('VCID');

    apiFetchGet('status/?id=' + VCID).then((d) => {
      // eslint-disable-next-line no-console
      console.log('fetch status', d);
    });
  };

  const sendBookRequest = () => {
    const VCID = searchParams.get('VCID');
    apiFetchPost({ date: dayjs(rtPicker.getDate()).format(DATE_FORMAT), id: VCID }, 'book/').then(
      (r) => {
        // eslint-disable-next-line no-console
        console.log('sendBookRequest', r);

        checkBookStatus();
      },
    );
  };

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('searchParams', Object.fromEntries(searchParams));

    const P = searchParams.get('P');
    const VCID = searchParams.get('VCID');
    const PCID = searchParams.get('PCID');

    if (P && VCID) {
      // todo
      apiFetchGet('get/?id=' + VCID + '&P=' + P).then((d) => {
        // eslint-disable-next-line no-console
        console.log('fetch get', d);

        setParkingData(d);
      });
    }
  }, [searchParams]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(
      'submissionDate',
      submissionDate,
      submissionDate && submissionDate.format(DATE_FORMAT),
    );
    rtPicker?.setDate((submissionDate || dayjs()).format(DATE_FORMAT)).render();
  }, [submissionDate]);

  useEffect(() => {
    if (parkingData) {
      if (parkingData?.state === 3) {
        setShowOrderInfo(true);
      } else {
        setOpenOrder(true);
      }
    }
  }, [parkingData]);

  useEffect(() => {
    const targetTime = dayjs().add(1, 'hour');

    const lang = {
      title: '',
      cancel: 'Отмена',
      confirm: 'Готово',
      year: '',
      month: '',
      day: '',
      hour: '',
      min: '',
      sec: '',
    };

    if (rtPicker) {
      rtPicker.setDate(targetTime.format(DATE_FORMAT)).render();
    } else if (pickerInputRef.current && rollDateRef.current) {
      rtPicker = new Rolldate(pickerInputRef.current, {
        //el: pickerInputRef.current,
        //alwaysOpen: true,
        //minStep: 5,
        //lang,
        //format: DATE_FORMAT,
        container: rollDateRef.current,
        text: lang,
        rows: 3,
        increment: {
          year: 1,
          month: 1,
          day: 1,
          hour: 1,
          minute: 1,
          second: 10,
          millisecond: 100,
        },
        inline: true,
        format: DATE_FORMAT,
        value: targetTime.format(DATE_FORMAT),
        beginYear: targetTime.format('YYYY'),
        endYear: parseInt(targetTime.format('YYYY')) + 1,
        init: function (e) {
          // eslint-disable-next-line no-console
          console.log('init');
        },
        moveEnd: function (scroll) {
          // eslint-disable-next-line no-console
          console.log('moveEnd', scroll);
        },
        confirm: function (date) {
          // eslint-disable-next-line no-console
          console.log(date);
          // eslint-disable-next-line no-console
          console.log('confirm', date);
        },
        cancel: function () {
          // eslint-disable-next-line no-console
          console.log('cancel');
        },
      });

      // eslint-disable-next-line no-console
      //console.log('rollTimeRef', rtPicker);
      //pickerInputRef.current.click();
    }
  }, [openTimePicker]);

  return (
    <>
      <div className="header">
        <span>PARKPASS VALET SERVICE</span>
        <img src={MEDIA_URL + (parkingData?.parking?.picture || '')} alt="" />
      </div>

      <div className="footer">
        <div
          className={
            'footer-container' +
            (openOrder ? ' __open' : '') +
            (openSubmissionTime || openTimePicker ? ' __overlay' : '')
          }
          onClick={(e) => {
            if (e.target?.classList?.contains('__overlay')) {
              setOpenSubmissionTime(false);
              setOpenTimePicker(false);
            }
          }}
        >
          {parkingData ? (
            <Order parkingData={parkingData} setOpenSubmissionTime={setOpenSubmissionTime} />
          ) : null}
        </div>

        <div className={'footer-container' + (showOrderInfo ? ' __open' : '')}>
          {parkingData ? (
            <OrderInfo setOpenTimePicker={setOpenTimePicker} parkingData={parkingData} />
          ) : null}
        </div>

        <div className={'footer-container' + (openSubmissionTime ? ' __open' : '')}>
          <SumbissionTime
            setOpenSubmissionTime={setOpenSubmissionTime}
            setOpenTimePicker={setOpenTimePicker}
            rtPicker={rtPicker}
            sendBookRequest={sendBookRequest}
          />
        </div>

        <div className={'footer-container' + (openTimePicker ? ' __open' : '')}>
          <Sumbission
            pickerMode={pickerMode}
            setPickerMode={setPickerMode}
            setSubmissionDate={setSubmissionDate}
            pickerInputRef={pickerInputRef}
            setOpenTimePicker={setOpenTimePicker}
            rtPicker={rtPicker}
            rollDateRef={rollDateRef}
            onSubmit={() => {
              // eslint-disable-next-line no-console

              const time = dayjs();
              const date = dayjs(rtPicker.getDate());

              if (pickerMode === 'date') {
                setPickerMode('time');
              } else {
                // eslint-disable-next-line no-console
                console.log('send request', rtPicker.getDate());
                sendBookRequest();
                setOpenTimePicker(false);
                setOpenOrder(false);
              }

              if (date.diff(time, 'm') < 0) {
                rtPicker.setDate(time.add(1, 'h').format(DATE_FORMAT)).render();
                setPickerMode('today');
              }

              // eslint-disable-next-line no-console
              console.log(rtPicker.getDate(), date.diff(time, 'm'));
            }}
          />
        </div>
      </div>
      <div
        className={'overlay ' + (openTimePicker || openOrder || openSubmissionTime ? '__show' : '')}
        onClick={(e) => {
          if (e.target?.classList?.contains('__show')) {
            setOpenSubmissionTime(false);
            setOpenTimePicker(false);
          }
        }}
      />
    </>
  );
};
