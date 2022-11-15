import React, { useEffect, useState, useMemo } from 'react';
import { ProgressBar } from './ProgressBar';
import { CHECK_STATUS_TIMER, dateDiff } from '../helpers/functions';
import { DATE_FORMAT } from '../api/api';

// dayjs
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
//import dayjsPluginUTC from 'dayjs-plugin-utc';
import advanced from 'dayjs/plugin/advancedFormat';

dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(advanced);

let updateTimer;
let updateDurationTimer;

window.dayJS = dayjs;

export const Progress = ({ parkingData }) => {
  const carDeliveryTime = useMemo(
    () => (parkingData?.car_delivery_time ? dayjs(parkingData.car_delivery_time) : ''),
    [parkingData?.car_delivery_time],
  );

  const submissionStartedAt = useMemo(
    () => (parkingData?.started_at ? dayjs(parkingData.started_at) : ''),
    [parkingData?.started_at],
  );

  const submissionPeriod = useMemo(
    () =>
      carDeliveryTime && submissionStartedAt ? carDeliveryTime.diff(submissionStartedAt, 's') : '',
    [carDeliveryTime, submissionStartedAt],
  );

  const [submissionDuration, setSubmissionDuration] = useState(
    submissionStartedAt ? dayjs().diff(submissionStartedAt, 's') : 0,
  );

  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    clearInterval(updateDurationTimer);

    if (carDeliveryTime) {
      updateDurationTimer = setInterval(() => {
        setSubmissionDuration(dayjs().diff(submissionStartedAt, 's'));
      }, CHECK_STATUS_TIMER);
    }

    return () => {
      clearInterval(updateDurationTimer);
    };
  }, [carDeliveryTime, submissionStartedAt]);

  useEffect(() => {
    clearInterval(updateTimer);

    updateTimer = setInterval(() => {
      setNow(dayjs());
    }, CHECK_STATUS_TIMER);

    return () => {
      clearInterval(updateTimer);
    };
  }, []);

  const timeLeft = useMemo(() => {
    // eslint-disable-next-line no-console
    console.log('now', now);
    return dateDiff(now, carDeliveryTime, true, -1);
  }, [now, carDeliveryTime]);

  const percentLeft = useMemo(() => {
    // eslint-disable-next-line no-console
    //console.log(
    //  'submissionDuration',
    //  submissionDuration,
    //  submissionPeriod,
    //  (submissionPeriod - submissionDuration) / submissionPeriod,
    //);
    return (100 * (submissionPeriod - submissionDuration)) / submissionPeriod;
  }, [submissionDuration, submissionPeriod]);

  // процент заполнения считается как
  // 100 - (100 * (car_delivery_time - started_at - (car_delivery_time  - сейчас)) / (car_delivery_time - started_at))

  return (
    <div className="order-booking">
      <ProgressBar text={'Осталось: ' + timeLeft} percent={100 - percentLeft} />
    </div>
  );
};
