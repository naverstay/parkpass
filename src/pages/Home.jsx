import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Rolldate from 'pickerjs';

import { Order } from '../components/Order';
import { API_URL, apiFetchGet, apiFetchPost, DATE_FORMAT, fixtures, MEDIA_URL } from '../api/api';
import { Submission } from '../components/Submission';
import { SubmissionTime } from '../components/SubmissionTime';
import { NoData } from '../components/NoData';
import { DevBlock } from '../components/DevBlock';
import { PageOverlay } from '../components/PageOverlay';

let rtPicker = null;
let statusWatchInterval = 0;

export const Home = () => {
  const now = dayjs();
  const pickerInputRef = useRef(null);
  const rollDateRef = useRef(null);
  const [pickerMode, setPickerMode] = useState('today');
  const [openNoData, setOpenNoData] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [openSubmissionTime, setOpenSubmissionTime] = useState(false);
  const [startStatusWatching, setStartStatusWatching] = useState(false);
  const [submissionDate, setSubmissionDate] = useState(now);
  const [parkingData, setParkingData] = useState(null); // fixtures
  let [searchParams, setSearchParams] = useSearchParams();

  const { P, VCID } = useMemo(() => {
    return {
      P: searchParams.get('P'),
      VCID: searchParams.get('VCID'),
    };
  }, [searchParams]);

  const sendBookRequest = useCallback(() => {
    apiFetchPost({ date: dayjs(rtPicker.getDate()).format(DATE_FORMAT), id: VCID }, 'book/').then(
      (r) => {
        // eslint-disable-next-line no-console
        console.log('sendBookRequest', r);
        setParkingData(r);
      },
    );
  }, [VCID]);

  useEffect(() => {
    if (P && VCID) {
      // todo
      apiFetchGet('get/?id=' + VCID + '&P=' + P).then((d) => {
        // eslint-disable-next-line no-console
        console.log('fetch get', d);

        setParkingData(d);
      });
    } else {
      setOpenNoData(true);
    }
  }, [VCID, P]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(
      'submissionDate',
      submissionDate,
      submissionDate && submissionDate.format(DATE_FORMAT),
    );

    const time = dayjs();
    let date = submissionDate || dayjs();

    if (date.diff(time, 'm') < 10) {
      date = time.add(11, 'm');
    }

    rtPicker?.setDate(date.format(DATE_FORMAT)).render();
  }, [submissionDate]);

  useEffect(() => {
    const checkBookStatus = () => {
      apiFetchGet('status/?id=' + VCID).then((d) => {
        if (d?.session_status) {
          setParkingData((p) => ({ ...p, state: d.session_status }));

          if (d.session_status === 10) {
            setStartStatusWatching(false);
            clearInterval(statusWatchInterval);
          }
        }
      });
    };

    if (startStatusWatching) {
      statusWatchInterval = setInterval(() => {
        checkBookStatus();
      }, 1000);
    }

    return () => {
      clearInterval(statusWatchInterval);
    };
  }, [startStatusWatching, VCID]);

  useEffect(() => {
    if (parkingData?.state) {
      setOpenNoData(false);

      if (!startStatusWatching && [4, 5, 6, 7].indexOf(parkingData.state) > -1) {
        setStartStatusWatching(true);
      }
    }
  }, [parkingData, startStatusWatching]);

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
          minute: 5,
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
      <DevBlock />
      {/* todo remove DevBlock */}
      <div className="header">
        <span>PARKPASS VALET SERVICE</span>
        {parkingData?.parking?.picture ? (
          <img src={MEDIA_URL + parkingData?.parking?.picture} alt="place" />
        ) : null}
      </div>

      <div className="footer">
        <div
          className={
            'footer-container' +
            (parkingData?.state > 0 ? ' __open' : '') +
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
            <Order
              parkingData={parkingData}
              setOpenTimePicker={setOpenTimePicker}
              setOpenSubmissionTime={setOpenSubmissionTime}
            />
          ) : null}
        </div>

        {/*<div className={'footer-container' + (parkingData?.state > 3 ? ' __open' : '')}>*/}
        {/*  {parkingData ? (*/}
        {/*    <OrderInfo*/}
        {/*      setOpenTimePicker={setOpenTimePicker}*/}
        {/*      setOpenSubmissionTime={setOpenSubmissionTime}*/}
        {/*      parkingData={parkingData}*/}
        {/*    />*/}
        {/*  ) : null}*/}
        {/*</div>*/}

        <div className={'footer-container' + (openSubmissionTime ? ' __open' : '')}>
          <SubmissionTime
            setOpenSubmissionTime={setOpenSubmissionTime}
            setOpenTimePicker={setOpenTimePicker}
            rtPicker={rtPicker}
            sendBookRequest={sendBookRequest}
          />
        </div>

        <div className={'footer-container' + (openNoData ? ' __open' : '')}>
          <NoData />
        </div>

        <div className={'footer-container' + (openTimePicker ? ' __open' : '')}>
          <Submission
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

              if (date.diff(time, 'm') < 10) {
                rtPicker.setDate(time.add(11, 'm').format(DATE_FORMAT)).render();
                setPickerMode('today');
                return false;
              }

              if (pickerMode === 'date') {
                setPickerMode('time');
              } else {
                // eslint-disable-next-line no-console
                console.log('send request', rtPicker.getDate());
                sendBookRequest();
                setOpenTimePicker(false);
              }

              // eslint-disable-next-line no-console
              console.log(rtPicker.getDate(), date.diff(time, 'm'));
            }}
          />
        </div>
      </div>

      <PageOverlay
        show={openSubmissionTime || openTimePicker}
        clickCallback={() => {
          setOpenSubmissionTime(false);
          setOpenTimePicker(false);
        }}
      />
    </>
  );
};
