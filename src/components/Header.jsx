import React, { useMemo, useRef } from 'react';
import { MEDIA_URL } from '../api/api';

const maxHeight = 360;
const SCROLL_POINT_TO_CHANGE_HEADER_CLASS = 300;

export const Header = ({ parkingData, windowScrollTop }) => {
  const headerImgRef = useRef(null);

  const imgHeight = useMemo(() => {
    return maxHeight - windowScrollTop;
  }, [windowScrollTop]);

  return (
    <div
      className={
        'header' + (windowScrollTop > SCROLL_POINT_TO_CHANGE_HEADER_CLASS ? ' __sticky' : '')
      }
    >
      <div className="header-inner">
        <span className="header-inner__text">PARKPASS VALET SERVICE</span>
        <div ref={headerImgRef} className="header-inner__img" style={{ height: imgHeight }}>
          {parkingData?.parking?.picture ? (
            <img src={MEDIA_URL + parkingData?.parking?.picture} alt="place" />
          ) : null}
        </div>
      </div>
    </div>
  );
};
