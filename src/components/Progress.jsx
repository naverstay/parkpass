import React, { useMemo } from 'react';
import { ProgressBar } from './ProgressBar';
import { appDayJS, dateDiff } from '../helpers/functions';

export const Progress = ({ parkingData, now }) => {
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
    () =>
      carDeliveryTime && requestCreatedAt
        ? carDeliveryTime.diff(requestCreatedAt.add(carDeliveryTime.utcOffset(), 'm'), 's')
        : '',
    [carDeliveryTime, requestCreatedAt],
  );

  const submissionDuration = useMemo(() => {
    return carDeliveryTime
      ? carDeliveryTime.diff(now.add(carDeliveryTime.utcOffset(), 'm'), 's')
      : 0;
  }, [now, carDeliveryTime]);

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

  const percentLeft = useMemo(() => {
    return submissionDuration / submissionPeriod;
  }, [submissionDuration, submissionPeriod]);

  // (NOW - submissionStartedAt) / (car_delivery_time - request.created_at)

  // eslint-disable-next-line no-console
  //console.log('submissionPeriod', submissionDuration, submissionPeriod);

  return (
    <ProgressBar
      text={timeLeft ? 'Осталось: ' + timeLeft : 'Время вышло'}
      percent={timeLeft ? 100 * (1 - percentLeft) : 100}
    />
  );
};
