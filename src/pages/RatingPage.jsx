import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { API_URL, apiFetchGet, apiFetchPost, DATE_FORMAT, fixtures, MEDIA_URL } from '../api/api';

import { Rating } from '../components/Rating';
import { NoData } from '../components/NoData';
import { PageOverlay } from '../components/PageOverlay';
import { Header } from '../components/Header';
import { NoConnection } from '../components/NoConnection';

export const RatingPage = ({ windowScrollTop }) => {
  const [openRating, setOpenRating] = useState(false);
  const [openNoData, setOpenNoData] = useState(false);
  const [openConnectionError, setOpenConnectionError] = useState(false);
  const [parkingData, setParkingData] = useState(fixtures); // fixtures
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('searchParams', Object.fromEntries(searchParams));

    const P = searchParams.get('P');
    const VCID = searchParams.get('VCID');
    const PCID = searchParams.get('PCID');

    if (P && VCID) {
      // todo
      apiFetchGet('get/?id=' + VCID + '&P=' + P)
        .then((d) => {
          setOpenConnectionError(false);
          // eslint-disable-next-line no-console
          console.log('fetch get', d);

          setParkingData(d);
        })
        .catch((e) => {
          setOpenConnectionError(true);
          // eslint-disable-next-line no-console
          console.log('apiFetchGet', e);
        });
    }
  }, [searchParams]);

  useEffect(() => {
    if (parkingData) {
      setOpenRating(true);
    }
  }, [parkingData]);

  return (
    <>
      <Header parkingData={parkingData} windowScrollTop={windowScrollTop} />

      <div className="booking">
        <div
          className={'booking-container' + (openRating ? ' __open' : '')}
          onClick={(e) => {
            if (e.target?.classList?.contains('__overlay')) {
              //setOpenRating(false);
            }
          }}
        >
          {parkingData ? <Rating parkingData={parkingData} /> : null}
        </div>

        <div className={'booking-container' + (openNoData ? ' __open' : '')}>
          <NoData />
        </div>

        <div className={'booking-container' + (openConnectionError ? ' __open' : '')}>
          <NoConnection />
        </div>
      </div>

      <PageOverlay
        show={openRating}
        clickCallback={() => {
          //setOpenRating(false);
        }}
      />
    </>
  );
};
