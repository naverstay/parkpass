import React, { useEffect, useRef, useState } from 'react';
import { MEDIA_URL } from '../api/api';

const initialHeight = 190;
const maxHeight = 360;
const INITIAL_SCROLL = 170;
const SCROLL_POINT_TO_CHANGE_HEADER_CLASS = 300;

export const Header = ({ parkingData, windowScrollTop }) => {
  const headerImgRef = useRef(null);

  return (
    <div
      className={
        'header' + (windowScrollTop > SCROLL_POINT_TO_CHANGE_HEADER_CLASS ? ' __sticky' : '')
      }
    >
      <div className="header-inner">
        <span className="header-inner__text">PARKPASS VALET SERVICE</span>
        <span ref={headerImgRef} className="header-inner__img">
          {parkingData?.parking?.picture ? (
            <img src={MEDIA_URL + parkingData?.parking?.picture} alt="place" />
          ) : null}
        </span>
      </div>
    </div>
  );
};
