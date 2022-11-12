import React from 'react';

export const ProgressBar = ({ percent, text }) => {
  return (
    <div className="progress-bar">
      <div className="progress-bar__value" style={{ width: percent + '%' }} />
      <div className="progress-bar__label">{text}</div>
    </div>
  );
};
