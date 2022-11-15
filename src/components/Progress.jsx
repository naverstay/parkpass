import React, { useEffect, useState, useMemo } from 'react';
import { ProgressBar } from './ProgressBar';
import { appDayJS, CHECK_STATUS_TIMER, dateDiff } from '../helpers/functions';
import { DATE_FORMAT } from '../api/api';

let updateTimer;
let updateDurationTimer;

window.dayJS = appDayJS;

export const Progress = ({ parkingData }) => {
  const carDeliveryTime = useMemo(
    () => (parkingData?.car_delivery_time ? appDayJS(parkingData.car_delivery_time) : ''),
    [parkingData?.car_delivery_time],
  );

  const requestCreatedAt = useMemo(
    () => (parkingData?.request?.created_at ? appDayJS(parkingData.request.created_at) : ''),
    [parkingData?.request?.created_at],
  );

  const submissionStartedAt = useMemo(
    () => (parkingData?.started_at ? appDayJS(parkingData.started_at) : ''),
    [parkingData?.started_at],
  );

  const submissionPeriod = useMemo(
    () => (carDeliveryTime && requestCreatedAt ? carDeliveryTime.diff(requestCreatedAt, 's') : ''),
    [carDeliveryTime, requestCreatedAt],
  );

  const [submissionDuration, setSubmissionDuration] = useState(
    submissionStartedAt ? appDayJS().diff(submissionStartedAt, 's') : 0,
  );

  const [now, setNow] = useState(appDayJS());

  useEffect(() => {
    clearInterval(updateDurationTimer);

    if (carDeliveryTime) {
      updateDurationTimer = setInterval(() => {
        setSubmissionDuration(appDayJS().diff(submissionStartedAt, 's'));
      }, CHECK_STATUS_TIMER);
    }

    return () => {
      clearInterval(updateDurationTimer);
    };
  }, [carDeliveryTime, submissionStartedAt]);

  useEffect(() => {
    clearInterval(updateTimer);

    updateTimer = setInterval(() => {
      setNow(appDayJS());
    }, CHECK_STATUS_TIMER);

    return () => {
      clearInterval(updateTimer);
    };
  }, []);

  const timeLeft = useMemo(() => {
    // eslint-disable-next-line no-console
    //console.log(
    //  'carDeliveryTime MMMMM',
    //  now.utcOffset(carDeliveryTime.utcOffset()).format(DATE_FORMAT),
    //  carDeliveryTime.utcOffset(),
    //  carDeliveryTime.format(DATE_FORMAT),
    //  carDeliveryTime.diff(now, 'm'),
    //  now.format(DATE_FORMAT),
    //);

    return dateDiff(now.add(carDeliveryTime.utcOffset(), 'm'), carDeliveryTime, true, -1);
  }, [now, carDeliveryTime]);

  // eslint-disable-next-line no-console
  //console.log('submissionPeriod', submissionDuration, submissionPeriod);

  const percentLeft = useMemo(() => {
    return submissionDuration / submissionPeriod;
  }, [submissionDuration, submissionPeriod]);

  return <ProgressBar text={'Осталось: ' + timeLeft} percent={percentLeft} />;
};
