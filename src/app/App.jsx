import React, { useEffect, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Home } from '../pages/Home';
import { useWindowDimension } from '../hooks/useWindowDimension';
import '../styles/main.scss';

import ArrowRight from '../ico/arrow_r.svg';
import Card from '../ico/card.svg';
import Clock from '../ico/clock.svg';
import Info from '../ico/info.svg';
import { SurveyPage } from '../pages/SurveyPage';
import { RatingPage } from '../pages/RatingPage';
import { getScrollTop } from '../helpers/functions';

const svgData = 'url("data:image/svg+xml,';

const svgStrArrowRight = `${svgData}${encodeURIComponent(renderToStaticMarkup(<ArrowRight />))}")`;
const svgStrCard = `${svgData}${encodeURIComponent(renderToStaticMarkup(<Card />))}")`;
const svgStrClock = `${svgData}${encodeURIComponent(renderToStaticMarkup(<Clock />))}")`;
const svgStrInfo = `${svgData}${encodeURIComponent(renderToStaticMarkup(<Info />))}")`;

const css = `
    .icon.__time::before {
        background-image: ${svgStrClock};
    }
    .icon.__info::before {
        background-image: ${svgStrInfo};
    }
    .icon.__card::before {
        background-image: ${svgStrCard};
    }
    .icon.__arrow-r::before {
        background-image: ${svgStrArrowRight};
    }
`;

const appHeight = () => {
  const doc = document.documentElement;
  const sab = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab')) || 0;
  doc.style.setProperty('--app-height', `${Math.max(200, window.innerHeight - sab)}px`);
};

export const App = () => {
  //const windowSize = useWindowDimension().join(',');
  //useEffect(() => {
  //  appHeight();
  //}, [windowSize]);

  const [windowScrollTop, setWindowScrollTop] = useState(getScrollTop());
  const handleScroll = (e) => {
    setWindowScrollTop(getScrollTop());
    // eslint-disable-next-line no-console
    console.log('handleScroll', getScrollTop());
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="page">
      <style>{css}</style>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home windowScrollTop={windowScrollTop} />} />
          <Route path="/survey" element={<SurveyPage windowScrollTop={windowScrollTop} />} />
          <Route path="/rating" element={<RatingPage windowScrollTop={windowScrollTop} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
