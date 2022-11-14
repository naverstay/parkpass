import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { API_URL, apiFetchGet, fixtures, MEDIA_URL } from '../api/api';
import { Header } from '../components/Header';
import { Survey } from '../components/Survey';
import { NoData } from '../components/NoData';
import { PageOverlay } from '../components/PageOverlay';

export const SurveyPage = ({ windowScrollTop }) => {
  const [openSurvey, setOpenSurvey] = useState(false);
  const [openRatings, setOpenRatings] = useState(false);
  const [openNoData, setOpenNoData] = useState(false);

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
      <Header parkingData={parkingData} windowScrollTop={windowScrollTop} />

      <div className="booking">
        <div className={'booking-container' + (openNoData ? ' __open' : '')}>
          <NoData />
        </div>

        <div
          className={'booking-container' + (openSurvey ? ' __open' : '')}
          onClick={(e) => {
            if (e.target?.classList?.contains('__overlay')) {
              //setOpenSurvey(false);
            }
          }}
        >
          {parkingData ? (
            <Survey parkingData={parkingData} setOpenRatings={setOpenRatings} />
          ) : null}
        </div>
      </div>

      <PageOverlay
        show={openSurvey}
        clickCallback={() => {
          //setOpenSurvey(false);
        }}
      />
    </>
  );
};
