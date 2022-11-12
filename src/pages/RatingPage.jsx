import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { API_URL, apiFetchGet, apiFetchPost, DATE_FORMAT, fixtures, MEDIA_URL } from '../api/api';

import { Rating } from '../components/Rating';
import { NoData } from '../components/NoData';

export const RatingPage = () => {
  const [openSurvey, setOpenSurvey] = useState(false);
  const [openNoData, setOpenNoData] = useState(false);

  const [parkingData, setParkingData] = useState(null); // fixtures
  let [searchParams, setSearchParams] = useSearchParams();

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
    if (parkingData) {
      setOpenSurvey(true);
    }
  }, [parkingData]);

  return (
    <>
      <div className="header">
        <span>PARKPASS VALET SERVICE</span>
        {parkingData?.parking?.picture ? (
          <img src={MEDIA_URL + parkingData?.parking?.picture} alt="place" />
        ) : null}
      </div>

      <div className="footer">
        <div className={'footer-container' + (openNoData ? ' __open' : '')}>
          <NoData />
        </div>
        <div
          className={'footer-container' + (openSurvey ? ' __open' : '')}
          onClick={(e) => {
            if (e.target?.classList?.contains('__overlay')) {
              //setOpenSurvey(false);
            }
          }}
        >
          {parkingData ? <Rating parkingData={parkingData} /> : null}
        </div>
      </div>
      <div
        className={'overlay ' + (openSurvey ? '__show' : '')}
        onClick={(e) => {
          if (e.target?.classList?.contains('__show')) {
            //setOpenSurvey(false);
          }
        }}
      />
    </>
  );
};
