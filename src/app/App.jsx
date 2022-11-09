import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { useWindowDimension } from '../hooks/useWindowDimension';
import '../styles/main.scss';

const appHeight = () => {
  const doc = document.documentElement;
  const sab = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab')) || 0;
  doc.style.setProperty('--app-height', `${Math.max(200, window.innerHeight - sab)}px`);
};

export const App = () => {
  const windowSize = useWindowDimension().join(',');
  useEffect(() => {
    appHeight();
  }, [windowSize]);

  return (
    <div className="page">
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
