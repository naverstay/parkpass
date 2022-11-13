import React, { useEffect, useState, useMemo } from 'react';
import { ProgressBar } from './ProgressBar';
import { dateDiff } from '../helpers/functions';
import dayjs from 'dayjs';

let updateTimer;
let updateDurationTimer;

export const Progress = ({ parkingData }) => {
  const submissionTime = useMemo(
    () => (parkingData?.car_delivery_time ? dayjs(parkingData.car_delivery_time) : ''),
    [parkingData?.car_delivery_time],
  );

  const submissionStart = useMemo(
    () => (parkingData?.started_at ? dayjs(parkingData.started_at) : ''),
    [parkingData?.started_at],
  );

  const submissionPeriod = useMemo(
    () => (submissionTime && submissionStart ? submissionTime.diff(submissionStart, 's') : ''),
    [submissionTime, submissionStart],
  );

  const [submissionDuration, setSubmissionDuration] = useState(
    submissionTime ? submissionTime.diff(dayjs(), 's') : 0,
  );

  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    clearInterval(updateDurationTimer);

    if (submissionTime) {
      updateDurationTimer = setInterval(() => {
        setSubmissionDuration(submissionTime.diff(dayjs(), 's'));
      }, 5000);
    }

    return () => {
      clearInterval(updateDurationTimer);
    };
  }, [submissionTime, submissionStart]);

  useEffect(() => {
    clearInterval(updateTimer);

    updateTimer = setInterval(() => {
      setNow(dayjs());
    }, 10000);

    return () => {
      clearInterval(updateTimer);
    };
  }, []);

  const timeLeft = useMemo(() => {
    return dateDiff(now, submissionTime, true);
  }, [now, submissionTime]);

  const percentLeft = useMemo(() => {
    return (100 * (submissionPeriod - submissionDuration)) / submissionPeriod;
  }, [submissionDuration, submissionPeriod]);

  return (
    <div className="order-footer">
      <ProgressBar text={'Осталось: ' + timeLeft} percent={100 - percentLeft} />
    </div>
  );
};
