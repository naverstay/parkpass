import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Rolldate from '../vendor/picker.esm';

import { Order } from '../components/Order';
import { apiFetchGet, apiFetchPost, DATE_FORMAT, fixtures, SERVER_DATE_FORMAT } from '../api/api';
import { Header } from '../components/Header';
import { Submission } from '../components/Submission';
import { SubmissionTime } from '../components/SubmissionTime';
import { NoData } from '../components/NoData';
import { DevBlock } from '../components/DevBlock';
import { PageOverlay } from '../components/PageOverlay';
import { appDayJS, CHECK_STATUS_TIMER, getClosestTime } from '../helpers/functions';
import { NoConnection } from '../components/NoConnection';

let rtPicker = null;
let statusWatchInterval = 0;

export const Home = ({ windowScrollTop, now }) => {
  const pickerInputRef = useRef(null);
  const rollDateRef = useRef(null);
  const [pickerMode, setPickerMode] = useState('today');
  const [openNoData, setOpenNoData] = useState(false);
  const [openConnectionError, setOpenConnectionError] = useState(false);
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
    apiFetchPost(
      { date: appDayJS(rtPicker.getDate()).format(SERVER_DATE_FORMAT), id: VCID },
      'book/',
    ).then((r) => {
      // eslint-disable-next-line no-console
      console.log('sendBookRequest', r);

      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(r.car_delivery_time)) {
        r.car_delivery_time = r.car_delivery_time.split(' ').join('T') + ':00z';
      }

      setParkingData(r);
    });
  }, [VCID]);

  useEffect(() => {
    if (P && VCID) {
      // todo
      apiFetchGet('get/?id=' + VCID + '&P=' + P)
        .then((d) => {
          setOpenNoData(false);
          setOpenConnectionError(false);
          //const deliveryTime = appDayJS(d.car_delivery_time);
          //
          //// eslint-disable-next-line no-console
          //console.log(
          //  'fetch get',
          //  d,
          //  deliveryTime.utcOffset(),
          //  appDayJS().add(deliveryTime.utcOffset(), 'm').isAfter(deliveryTime),
          //);

          setParkingData(d);
        })
        .catch((e) => {
          setOpenConnectionError(true);
          // eslint-disable-next-line no-console
          console.log('apiFetchGet', e);
        });
    } else {
      setOpenNoData(true);
    }
  }, [VCID, P]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    //console.log(
    //  'submissionDate',
    //  submissionDate,
    //  submissionDate && submissionDate.utcOffset(0).format(DATE_FORMAT),
    //);

    const time = appDayJS();
    let date = submissionDate || appDayJS();

    if (date.diff(time, 'm') < 10) {
      date = getClosestTime(appDayJS().add(10, 'm'), 5, 'm');
    }

    rtPicker?.setDate(date.format(DATE_FORMAT)).render();
  }, [submissionDate]);

  useEffect(() => {
    rtPicker
      ?.setDate(
        appDayJS()
          .add(pickerMode === 'today' ? 0 : 1, 'd')
          .format(DATE_FORMAT),
      )
      .render();
  }, [pickerMode]);

  useEffect(() => {
    const checkBookStatus = () => {
      apiFetchGet('status/?id=' + VCID).then((d) => {
        if (d?.session_status) {
          setParkingData((p) => ({ ...p, state: d.session_status }));

          if (d.session_status > 7) {
            setStartStatusWatching(false);
            clearInterval(statusWatchInterval);
          }
        }
      });
    };

    if (startStatusWatching) {
      statusWatchInterval = setInterval(() => {
        checkBookStatus();
      }, CHECK_STATUS_TIMER);
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
    const targetTime = appDayJS().add(1, 'hour');

    const lang = {
      title: '',
      cancel: '????????????',
      confirm: '????????????',
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
          minute: 5,
        },
        inline: true,
        format: DATE_FORMAT,
        value: targetTime.utcOffset(0).format(DATE_FORMAT),
        //beginYear: targetTime.format('YYYY'),
        //endYear: parseInt(targetTime.format('YYYY')) + 1,
        //init: function (e) {
        //  // eslint-disable-next-line no-console
        //  console.log('init');
        //},
        //moveEnd: function (scroll) {
        //  // eslint-disable-next-line no-console
        //  console.log('moveEnd', scroll);
        //},
        //confirm: function (date) {
        //  // eslint-disable-next-line no-console
        //  console.log(date);
        //  // eslint-disable-next-line no-console
        //  console.log('confirm', date);
        //},
        //cancel: function () {
        //  // eslint-disable-next-line no-console
        //  console.log('cancel');
        //},
      });

      // eslint-disable-next-line no-console
      //console.log('rollTimeRef', rtPicker);
      //pickerInputRef.current.click();
    }
  }, [openTimePicker]);

  return (
    <>
      {/*<DevBlock />*/}
      {/* todo remove DevBlock */}
      <Header windowScrollTop={windowScrollTop} parkingData={parkingData} />

      <div className="booking">
        <div
          className={
            'booking-container' +
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
            <div className="container">
              <Order
                now={now}
                windowScrollTop={windowScrollTop}
                parkingData={parkingData}
                setOpenTimePicker={setOpenTimePicker}
                setOpenSubmissionTime={setOpenSubmissionTime}
              />
            </div>
          ) : null}
        </div>

        {/*<div className={'booking-container' + (parkingData?.state > 3 ? ' __open' : '')}>*/}
        {/*  {parkingData ? (*/}
        {/*    <OrderInfo*/}
        {/*      setOpenTimePicker={setOpenTimePicker}*/}
        {/*      setOpenSubmissionTime={setOpenSubmissionTime}*/}
        {/*      parkingData={parkingData}*/}
        {/*    />*/}
        {/*  ) : null}*/}
        {/*</div>*/}

        <div className={'booking-container' + (openSubmissionTime ? ' __open' : '')}>
          <div className="container">
            <SubmissionTime
              setOpenSubmissionTime={setOpenSubmissionTime}
              setOpenTimePicker={setOpenTimePicker}
              rtPicker={rtPicker}
              sendBookRequest={sendBookRequest}
            />
          </div>
        </div>

        <div className={'booking-container' + (openTimePicker ? ' __open' : '')}>
          <div className="container">
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

                const time = appDayJS();
                const date = appDayJS(rtPicker.getDate());

                if (date.diff(time, 'm') < 10) {
                  rtPicker
                    .setDate(getClosestTime(appDayJS().add(10, 'm'), 5, 'm').format(DATE_FORMAT))
                    .render();
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

        <div className={'booking-container' + (openNoData ? ' __open' : '')}>
          <div className="container">
            <NoData />
          </div>
        </div>

        <div className={'booking-container' + (openConnectionError ? ' __open' : '')}>
          <div className="container">
            <NoConnection />
          </div>
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
