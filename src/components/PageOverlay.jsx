import React from 'react';

export const PageOverlay = ({ clickCallback, show }) => {
  return (
    <div
      className={'overlay ' + (show ? '__show' : '')}
      onClick={(e) => {
        if (typeof clickCallback === 'function') {
          if (e.target?.classList?.contains('__show')) {
            clickCallback();
          }
        }
      }}
    />
  );
};
